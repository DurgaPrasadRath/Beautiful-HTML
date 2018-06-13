import React from 'react';
import Link from 'gatsby-link';

export default function Navigation() {
  return (
      <div className="navigation">
        <span className="nav-item">
          <Link to="/" exact activeClassName="nav-active"><span className="nav-number">00</span><span className="nav-text">Home</span><br /></Link>
        </span>
        <span className="nav-item">
          <Link to="/about" activeClassName="nav-active"><span className="nav-number">01</span><span className="nav-text">About</span><br /></Link>
        </span>
        <span className="nav-item">
          <Link to="/products" activeClassName="nav-active"><span className="nav-number">02</span><span className="nav-text">Products</span><br /></Link>
        </span>
        <span className="nav-item">
          <Link to="/blog/1" activeClassName="nav-active"><span className="nav-number">03</span><span className="nav-text">Blog</span><br /></Link>
        </span>
        <span className="nav-item">
          <Link to="/careers" activeClassName="nav-active"><span className="nav-number">04</span><span className="nav-text">Careers</span></Link>
        </span>
      </div>
  );
}
