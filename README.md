# cbrebuild_nyc

## Getting Started

#### Node.js

This app uses node version `7.10.1`. To install:

```
nvm install 7.10.1
```

Switching to this repo from one that uses a different version of node? nvm defaults to the version saved in `.nvmrc`, so just:

```
nvm use
```

#### Yarn

```
brew install yarn --without-node
yarn add
```

`yarn add` will install packages from the package.json file and should be run whenever new packages are added.

#### Gatsby

```
yarn global add gatsby-cli
```

To run a server locally with hot reloading:
```
gatsby develop
```

The site will be available at http://localhost:8000

The Admin UI will be at http://localhost:8000/admin/

Login credentials for the Admin panel need to be sent via Netlify

To create an optimized build production:
```
gatsby build
```

To strart a local HTML server for testing your build:
```
gatsby serve
```
