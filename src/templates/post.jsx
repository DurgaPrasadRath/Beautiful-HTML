import React from 'react';
import Link from 'gatsby-link';
import moment from 'moment';

import Header from '../components/Header';
import Footer from '../components/Footer';


export default function Template({ data, pathContext }) {
  const { markdownRemark } = data;
  const { previousPost, nextPost, totalPosts, postIndex } = pathContext;
  const { html, fields, frontmatter } = markdownRemark;
  const time = moment(frontmatter.date).fromNow();

  //post & pagination index calculation
  let i = totalPosts - postIndex + 1;
  let page = Math.floor((totalPosts - i)/10) + 1;
  if (i < 10) i = `0${  i.toString()}`;
  if (page < 10) page = `0${ page.toString()}`;
  const indexString =  page + '.' + i.toString();

  const PaginationLink = (props) => {
    if (props.text && props.node) {
      return (
        <div className="blog-post-nav">
          <Link to={props.node.fields.path}>
            {props.text}<br/>
            {props.node.frontmatter.title}
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="blog-post">
      <Header />
      <div>
        <div className="light-green-section">
          <div className="extra-large-text">
            <span className="blog-index">{indexString} ∕</span><br />
            <span>{frontmatter.title}</span>
          </div>
          <div className="white-box">
            <div className="meta-rect">
              <div>
                <span className="posted">Posted <br />{time}</span>
              </div>
              <div className="last-of-type-sm">
                <span className="posted">by <br />{frontmatter.author}</span>
              </div>
              <div className="hidden-sm">
                <span className="posted">#{frontmatter.tags[0]}</span>
              </div>
              <div className="hidden-sm">
                <span className="posted">{indexString}</span>
              </div>
            </div>
            <div className="blog-content">
              <p></p> {/* for some reason extra space gets added without an empty paragph before */}
              <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </div>
          </div>
          {/* next/previous post navigation */}
          <div className="row">
            <div className="col-5 col-12-sm">
              { previousPost && previousPost.node && 
                <div className="blog-nav older">
                  <PaginationLink node={previousPost.node} text="&larr; Next newer post" />
                </div>
              }
            </div>
            <div className="col-2 hidden-sm"></div>
            <div className="col-5 col-12-sm">
              { nextPost && nextPost.node &&
                <div className="blog-nav">
                  <PaginationLink node={nextPost.node} text="Next older post &rarr;" />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(fields: { path: { eq: $path } }) {
      html
      frontmatter {
        author
        title
        tags
        date
      }
    }
  }
`;
