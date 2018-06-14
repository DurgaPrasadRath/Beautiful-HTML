---
author: Ben L
title: Moving To CouchDB 2.x
tags:
  - Engineering
  - Database
date: '2018-05-11'
---

### Introduction

In the CBRE Build New York office, we manage databases with [CouchDB](https://couchdb.apache.org) for its flexibility, scalability, and low maintenance overhead. To take advantage of the latest features, including the support for clustering discussed below, we recently decided to upgrade from version 1.6.1 to the latest version, 2.1.1, and that transition is nearing its conclusion. This post will talk about the process of upgrading, starting by describing what our old database cluster looked like, continuing with what our new cluster looks like, and finishing with notes about how we interact with the cluster and about some extra features we implemented. Hopefully this can be a helpful resource for anyone looking to make a similar switch!


### Our Couch 1.6.1 Cluster

To distribute load and keep several copies of our data, we ran multiple instances of CouchDB and kept data synced between them; together, these linked Couch “nodes” formed a “cluster”. Couch 1.x doesn't have built-in support for clustering, so our three-node 1.6.1 cluster was constructed via explicit replications pointing from each node to both of its peers. To make sure that database creations were propagated to each node, and to make sure that replications were managed correctly, we ran a companion server (which we called "Bolster") alongside Couch on each node. For performance and reliability, [HAProxy](http://www.haproxy.org/) was set up in front of both Bolster and the Couch server on each node; HAProxy sent db creation requests to Bolster and all other requests directly to Couch. In all, the basic setup looked something like this:

![couch 1.6.1 cluster setup](/assets/blog/couch_1_to_2/bolster_setup.png)


### Our 2.1.1 Cluster

Couch 2.x does support clustering, so we can eliminate the Bolster and HAProxy elements of the 1.x setup and direct all requests to Couch. The new setup looks like:

![couch 1.6.1 cluster setup](/assets/blog/couch_1_to_2/couch2_setup.png)

Getting the `n` nodes in our cluster to communicate is the topic of the next section.


#### Cluster Setup

Creating a functioning cluster from our nodes entails a couple things: setting up configuration values and making sure those values are synced between nodes, and making requests to Couch’s `_cluster_setup` endpoint to link nodes together. Couch has pretty extensive docs on both of these topics ([configuration](http://docs.couchdb.org/en/2.1.1/config/index.html) and [`_cluster_setup`](http://docs.couchdb.org/en/2.1.1/cluster/setup.html#the-cluster-setup-api)), but there was still some amount of experimentation before arriving at a working setup. This section doesn’t aim to walk through all of our configuration -- you can see the bottom of this post for some [annotated configuration snippets](#annotated-configuration-snippets). Rather, our intention is to highlight a couple aspects that we found interesting during cluster setup and that provided some insight into how Couch works.

##### Syncing admin user credentials

The last bit of configuration we do before linking our nodes together is to create a server admin user. Since server admin credentials are stored in .ini config files on each node and not in the \_users database, they are not automatically synced, so we need to manage that ourselves. Furthermore, not only do the passwords stored on each node have to be identical, their hashes need to match as well.

One approach to ensuring this consistency would be to keep server admin credentials in a config file somewhere that could be updated externally and then pulled into each node whenever we want to add or modify a user. This approach would require restarting each Couch server after pulling in the new credentials, and it would require storing credentials in multiple places.

The approach we take instead is to use Couch’s [configuration API endpoint](http://docs.couchdb.org/en/2.1.1/api/server/configuration.html#put--_node-node-name-_config-section-key) to sync credentials across nodes without requiring a server restart. When the first server admin is created during cluster configuration, or when a server admin is added or modified at a later date, we run a script on one node in the cluster that goes through the following steps:

1. Issues a PUT request to the configuration endpoint on the current node to create a new server admin user. The password can be passed in plaintext, and it will be hashed by Couch

2. Issues a GET request to the same endpoint to get the new password hash

3. Issues a PUT request to the configuration endpoint on each other node, using the hashed password as the value. Couch will not re-hash the password, so the value on each other node will match that on the first node

The result will be a section in each node’s .ini file that looks like:

```ini
[admins]
<username> = <hashed_pw>
```
<br />

Note that the API endpoint approach could be used to add all configuration values, but for simplicity, we only use it for ones that are secret or are more likely to change (i.e., server admin credentials and the [`secret`](http://docs.couchdb.org/en/2.1.1/config/auth.html#couch_httpd_auth/secret) token for cookie auth), and we stick everything else in a custom .ini file that is added to each node on node creation.

##### Linking nodes in the cluster

After configuration values, including server admin credentials, are set on each node, we can start linking the nodes together. This can be done from a single node by running a subset of the cluster setup commands [listed here](http://docs.couchdb.org/en/2.1.1/cluster/setup.html#the-cluster-setup-api):

```bash
# assume USERNAME and PASSWORD are set to the new server admin's credentials

# for each other node in the cluster (assume NODE_DNS is the dns name of the node):
curl -X POST -H "Content-Type: application/json" http://$USERNAME:$PASSWORD@127.0.0.1:5984/_cluster_setup -d '{"action": "add_node", "host": "'$NODE_DNS'", "port": 5984, "username": "'$USERNAME'", "password":"'$PASSWORD'"}'

# once:
curl -X POST -H "Content-Type: application/json" http://$USERNAME:$PASSWORD@127.0.0.1:5984/_cluster_setup -d '{"action": "finish_cluster"}'
```
<br />

This deviates from the documentation by omitting the `"action": "enable_cluster"` requests; we can do this [because](https://github.com/apache/couchdb/blob/ae29e652762c1be8029346592ab0bfb1c73a6bf4/src/setup/src/setup.erl#L43) we already set up server admin credentials and set `bind_address = 0.0.0.0` in the `[chttpd]` section of our config (see the [configuration snippets below](#annotated-configuration-snippets)). Attempting to issue one of the `enable_cluster` requests would come back with a “Cluster is already enabled” error.

At this point, our cluster should be ready to rock and roll! In the next section, we’ll talk about some structure we impose on our interactions with the cluster.

#### Working with the cluster: conventions, user model, and updates to Fauxton

##### Application databases and their roles

Our team has a relatively small number of applications and databases, so it makes sense for us to keep all of our dbs in the same cluster. To maintain some kind of separation between the apps' dbs, we stick to a naming convention for dbs and their associated user roles. Any dbs belonging to an app named “app” are prefixed by `app__`, e.g., `app__db1`. User roles associated with `app` are identically prefixed, e.g., `app__readonly`. Each app supports three roles, which grant different levels of db access when assigned to a user, through a combination of its dbs' [permissions objects](http://docs.couchdb.org/en/2.1.1/api/database/security.html#db-security) and \_design/\_auth documents:

1. `app__dbadmin`: db admin access

2. `app__member`: db member access

3. `app__readonly`: db member access, but each database includes a \_design/\_auth document with a [`validate_doc_update` function](http://docs.couchdb.org/en/2.1.1/ddocs/ddocs.html#validate-document-update-functions) that throws a `forbidden` error if a user with this role attempts to write

##### System databases and their roles

By default, anyone can put a doc in the \_users database or see the \_users and \_replicator dbs' metadata, since no member permissions are set on those dbs. Since we don't need that functionality, we set up the \_users db to specify db member permissions for the role `builder` and the \_replicator db to specify db member permissions for the role `replicator`.

##### Using these roles

This brings us to our user access model, which is meant to restrict each user's access to their necessary functions. Besides server admins, who are responsible for db creation and deletion, we support a few basic types of users:

1. deployers: view functions are added to our dbs at deploy time, so people responsible for deploying application code need to be able to write \_design documents, which requires db admin credentials. Each deployer is given a Couch user with an `<app>__dbadmin` role and the `builder` role (the latter ensures that deployers can access their docs in the \_users database to change their passwords)

2. applications: application interaction with CouchDB requires only db member credentials, since dbs are created manually by server admins and \_design docs are added at deploy time by deployers. Each of our applications is given a user with an `<app>__member` role

3. readonly users: some of our users require only read access; these are given an `<app>__readonly` role for one or more apps. If the user belongs to a real person, it is also given the `builder` role to allow password changing

4. source replicator user: replications set up via docs in the \_replicator database require credentials and roles that grant read access to the source database. Note that replication also causes writes to [\_local documents](http://docs.couchdb.org/en/2.1.1/api/local.html), but updates to those documents don’t pass through the `validate_doc_update` function mentioned above, so our readonly role is sufficient. We elected to create a single source replicator user for all of our dbs, so this user is given an `<app>__readonly` role for each app. We also use this user's credentials to trigger the replication by putting a doc in the \_replicator db, so for write access to that database, we give the user the `replicator` role

5. target replicator user: the target-end counterpart of our source replicator, this user needs to be able to write any docs being replicated, including \_design docs, so this user is given an `<app>__dbadmin` role for each app

With users of these types created, we can start using our cluster in production and feel secure that each user has only the necessary access.

##### Changes to [Fauxton](http://couchdb.apache.org/fauxton-visual-guide/)

Our user access model requires each app's databases to support the `<app>__*` roles in their permissions objects and \_design/\_auth docs. We decided to avoid adding any external processes to ensure this support -- e.g., running a script that polls the `_db_updates` endpoint for database creations -- instead opting to add some functionality to Fauxton and adopt that as our main point of database creation. Whenever a database is created through our modified version of Fauxton, we identify its prefix and add support for correspondingly prefixed roles to its permissions object and \_design/\_auth document.

On the user side of role support, we added a widget to Fauxton’s \_users database document editor to facilitate setting prefixed roles on users.

Feel free to check out these changes and a couple others in [our fork of apache's couchdb-fauxton repo](https://github.com/floored/couchdb-fauxton#cbre-build-fork-of-fauxton).


### For reference

<h4 id="annotated-configuration-snippets">Annotated configuration snippets</h4>

Below are some salient entries from the configuration files we ended up adding or modifying, just in case they are helpful for reference. The contents of both of these files live on all nodes in the cluster.

etc/vm.args (command line arguments passed to the Couch server; note that the values below are just the ones we added or edited):

```bash
# use full ip or dns name for node
-name <ip_or_dns>

# specify port range for inter-node erlang communication
-kernel inet_dist_listen_min 9100
-kernel inet_dist_listen_max 9200
```
<br />


etc/local.d/common.ini (configuration used by the Couch server; note that comments are started with a semicolon):

```ini
[chttpd]
; note: if you use the couch_httpd_auth handlers here rather than chttpd_auth handlers, you may run into baffling authentication issues,
; wherein you are able to create a session using a user's credentials, but any attempt to log into fauxton or request data is met with
; an "incorrect username or password" error
authentication_handlers = {chttpd_auth, cookie_authentication_handler}, {chttpd_auth, default_authentication_handler}

; allow couch to listen to requests to the clustered port from any address. Note that if you also have a server admin user configured
; in an .ini file, attempting to hit the _cluster_setup endpoint with the "enable_cluster" action will generate a "Cluster is already
; enabled" error. If you've configured bind_address, an admin, a replica count, and a chttpd port, you shouldn't need to make a request to
; _cluster_setup with the "enable_cluster" action
bind_address = 0.0.0.0

[couch_httpd_auth]
; require all requests on node-local port to come from authenticated users. We don't also do this on the clustered port for a couple reasons:
;   - our load balancer pings each instance's couch server to make sure it is up, and we don't want to store credentials on the
;     load balancer
;   - hitting the /_utils endpoint to access Fauxton's login page would also require credentials. Setting up basic auth could kind of get around
;     this issue, but together with the load balancer issue, it was enough to call it a day on require_valid_user for the clustered port
require_valid_user = true
```
<br />
