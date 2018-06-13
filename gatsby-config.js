const manifest = require('./src/assets/favicon/site.webmanifest.json');

module.exports = {
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-stylus',
    'gatsby-plugin-netlify-cms',
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
