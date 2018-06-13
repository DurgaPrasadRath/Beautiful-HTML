import React from 'react';
import Link from 'gatsby-link';

import Navigation from './Navigation';
import Logo from './Logo';

export default function Header(props) {
  return (
    <section id="header">
      <div className="meta-rect">
        <div>
          <div className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </div>
        </div>
        <div className="last-of-type-sm">
          <Navigation />
        </div>
        <div className="hidden-sm"></div>
        <div className="hidden-sm"></div>
      </div>
    </section>
  );
}
