import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import moment from 'moment';

export default function FlashyLink({ content, to, metaIndex }) {

  return (
    <Link className="flashy-link" to={to} >
      <div className="flashy-link-content">{content}</div>
      <div className="meta-rect extra-small bottom">
        <div><span>{metaIndex}</span></div>
        <div className="arrow-container"><span>&rarr;</span></div>
      </div>
    </Link>
  );
}
