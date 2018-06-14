const manifest = require('./src/assets/favicon/site.webmanifest.json');

module.exports = {
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-stylus',
    {
    resolve: `gatsby-plugin-netlify-cms`,
    options: {
      // One convention is to place your Netlify CMS customization code in a
      // `src/cms` directory.
      modulePath: `${__dirname}/src/cms/cms.js`,
    },
  },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'markdown-pages',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs'
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: manifest,
    }
  ],
};
