const fs = require('fs');
const request = require('request');
const mkdirp = require('mkdirp');
const { get } = require('lodash');

const username = 'cbrebuild_nyc';

// Convert timestamp to ISO 8601.
const toISO8601 = timestamp => new Date(timestamp * 1000).toJSON();

// Create the images directory
mkdirp.sync('./data');

const posts = [];

// Write json
const saveJSON = _ =>
  fs.writeFileSync('./data/social.json', JSON.stringify(posts, '', 2));

const getPosts = (maxId) => {
  let url = `https://www.instagram.com/${username}/?__a=1`;

  request(url, { encoding: 'utf8' }, (err, res, body) => {
    if (err) console.log(`error: ${err}`);
    body = JSON.parse(body).graphql;
    body.user.edge_owner_to_timeline_media.edges
      .filter(({ node: item }) => item.__typename === 'GraphImage')
      .map(({ node: item }) => 
        // Parse item to a simple object
         ({
          id: get(item, `id`),
          code: get(item, `shortcode`),
          time: toISO8601(get(item, `taken_at_timestamp`)),
          type: get(item, `__typename`),
          likes: get(item, `edge_liked_by.count`),
          comment: get(item, `edge_media_to_comment.count`),
          text: get(item, `edge_media_to_caption.edges[0].node.text`),
          media: get(item, `display_url`),
          image: `images/${item.shortcode}.jpg`,
          username: get(body, `user.username`),
          avatar: get(body, `user.profile_pic_url`),
        })
      )
      .forEach((item) => {
        if (posts.length >= 1) return;

        // Add item to posts
        posts.push(item);
      });

    const lastId = get(body, 'user.media.page_info.end_cursor');
    if (posts.length < 1 && lastId) getPosts(lastId);
    else saveJSON();
  });
};

getPosts();
