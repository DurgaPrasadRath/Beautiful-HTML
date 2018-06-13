import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

export default function JobBox({ job }) {
  const { frontmatter } = job;

  return (
    <div className="white-box job-box col-6 col-12-sm">
      <p className="large-text">{frontmatter.title}</p>
      <div className="meta-rect bottom">
        <div><span></span></div>
        <div className="hidden-sm"></div>
        <div className="no-border">
          <a className="apply-button" href={frontmatter.url}>Apply <span className="arrow">&rarr;</span></a>
        </div>
      </div>
    </div>
  );
}
