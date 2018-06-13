import React, { Component } from 'react';
import Link from 'gatsby-link';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogBox from '../components/BlogBox';

const PaginationLink = (props) => {
  if (props.to && props.text) {
    return <Link to={props.to}>{props.text}</Link>;
  }
  return null;
};

const IndexPage = ({ data, pathContext }) => {
  let {
 page, prev, next, pages, total, limit 
} = pathContext;
  const nodes = pathContext.nodes.map(node => node.node);

  if (pages < 10) pages = '0' + pages;
  if (page < 10) page = '0' + page;

  // add node index to show which blog post # this is
  nodes.forEach((node, index) => {
    let i = total - (index + ((page - 1) * limit));
    if (i < 10) i = `0${  i.toString()}`;
    node.index = page + '.' +  i;
  });

  // separate out the latest blog for the UI (once we have social)
  const featuredBlog = nodes.shift();

  const BlogNavigation = () => {
    return (
      <div className="row blog-nav-row">
        <div className="col-4 col-12-sm">
          {prev && <div className="blog-nav">
            <PaginationLink to={prev} text="&larr; Newer Posts" />
          </div>}
        </div>
        <div className="col-4 hidden-sm">
          <div className="page-counter">{page} ∕ {pages}</div>
        </div>
        <div className="col-4 col-12-sm">
          {next && <div className="blog-nav older">
            <PaginationLink to={next} text="Older Posts &rarr;" />
          </div>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div id="blogs">
        <div className="light-green-section">
          <div className="hidden-lg"><h1>Build Blog</h1></div>
          <div className="hidden-sm"><BlogNavigation /></div>
          <div className="row">
          <BlogBox post={featuredBlog} total={total} key="1" />
          { nodes.map(node => <BlogBox post={node} total={total} key={node.id} />)}
          <BlogNavigation />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default IndexPage;
