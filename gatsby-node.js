const path = require('path');
const { createPaginationPages } = require('gatsby-pagination');

exports.onCreateNode = ({ node, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === 'MarkdownRemark') {
    createNodeField({
      node,
      name: 'path',
      value: node.fileAbsolutePath.split('/src/pages')[1].split('.')[0],
    });
  }
};

function createAboutPage(createPage) {
  const template = path.resolve('src/templates/about.jsx');

  createPage({
    path: '/about',
    component: template,
  });
}

function createProductsPage(createPage) {
  const template = path.resolve('src/templates/products.jsx');

  createPage({
    path: '/products',
    component: template,
  });
}

function createCareersPage(createPage) {
  const template = path.resolve('src/templates/careers.jsx');

  createPage({
    path: '/careers',
    component: template,
  });
}

function createBlogPages(createPage, createNodeField, graphql) {
  const template = path.resolve('src/templates/post.jsx');

  return graphql(`
  {
    allMarkdownRemark(
      limit:1000,
      sort: { order: DESC, fields: [frontmatter___date]},
      filter: { fileAbsolutePath: {regex : "\/posts/"} },
    ) {
      edges {
        node {
          id,
          html,
          excerpt,
          internal {
            content,
            owner,
            type,
            fieldOwners {
              path
            }
          },
          children { id },
          frontmatter {
            title,
            tags,
            author,
            date
          }
          fields {
              path
          }
        }
      }
    }
  }
`).then((result) => {
    if (result.errors) {
      console.error(result.errors);
      return Promise.reject(result.errors);
    }

    const edges = result.data.allMarkdownRemark.edges;
    const count = edges.length;

    createPaginationPages({
      edges,
      createPage,
      component: path.resolve('src/templates/posts.jsx'),
      limit: 10,
      pathFormatter: path => `/blog/${path}`,
    });

    return edges.forEach((edge, index) => {
      const node = edge.node;
      let postIndex = index + 1;
      if (postIndex < 10) postIndex = '0' + postIndex;

      createPage({
        path: node.fields.path,
        component: template,
        context: {
          previousPost: index > 0 ? edges[index - 1] : null,
          nextPost: index < edges.length - 1 ? edges[index + 1] : null,
          totalPosts: count,
          postIndex,
        },
      });
    });
  });
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage, createNodeField } = boundActionCreators;

  return createBlogPages(createPage, createNodeField, graphql)
    .then(() => createAboutPage(createPage))
    .then(() => createCareersPage(createPage))
    .then(() => createProductsPage(createPage));
};
