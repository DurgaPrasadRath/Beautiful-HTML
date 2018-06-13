import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import moment from 'moment';

export default function BlogBox({ post, total }) {
  const { frontmatter } = post;
  const time = moment(frontmatter.date).fromNow();
  const title = frontmatter.title.length < 50 ? frontmatter.title : frontmatter.title.substring(0,47) + '...';

  return (
    <div className="white-box col-6 col-12-sm blog-box">
      <div className="meta-rect">
        <div>
          <span className="posted">Posted <br />{time}</span>
        </div>
        <div>
          <span className="posted">by <br />{frontmatter.author}</span>
        </div>
      </div>
      <div className="blog-intro">
        <div className="blog-title">
          <Link className="large-text" to={post.fields.path}>{title}</Link>
        </div>
        <p className="post-excerpt">{post.excerpt}</p>
        <Link to={post.fields.path}>Keep reading &rarr;</Link>
      </div>
      <div className="meta-rect small bottom">
        <div>
          <span className="posted">{post.index}</span>
        </div>
        <div>
          <span className="posted">Engineering</span>
        </div>
      </div>
    </div>
  );
}
