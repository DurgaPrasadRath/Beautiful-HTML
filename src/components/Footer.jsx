import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import Navigation from './Navigation';
import Logo from './Logo';

export default function Footer(props) {

  return (
    <section id="footer">
      <div className="meta-rect dark">
        <div className="last-of-type-sm">
          <div className="logo">
            <Link to="/">
              <Logo fillColor = '#00ff44' />
            </Link>
          </div>
          <div className="nyc">NYC</div>

          <div className="hidden-lg">
            <div className="dashes">__________________</div>
            <a href="mailto:hello@cbrebuild.com">hello@cbrebuild.com</a><br/>
            <a href="tel:8442325575">844 232 5575</a>
            <div className="dashes">__________________</div>
            <a href="https://www.google.com/maps/place/275+7th+Ave+%231705,+New+York,+NY+10011/@40.7455297,-73.9963182,17z/data=!3m1!4b1!4m5!3m4!1s0x89c259a537dbdaad:0x649ec638de307fd9!8m2!3d40.7455297!4d-73.9941242">
              <span>275 7th Avenue<br />#1705<br />NY, NY 10001</span>
            </a>
            <div className="dashes">__________________</div>
            <div className="social">
              <a href="https://www.instagram.com/cbrebuild_nyc/" className="icon alt fa-twitter" />
              <a href="https://twitter.com/cbrebuild_nyc" className="icon alt fa-instagram" />
            </div>
          </div>

        </div>
        <div className="social hidden-sm">
          <a href="https://twitter.com/cbrebuild_nyc" className="icon alt fa-twitter" />
          <a href="https://www.instagram.com/cbrebuild_nyc/" className="icon alt fa-instagram" /><br/>
          <a href="mailto:hello@cbrebuild.com">hello@cbrebuild.com</a><br/><br/>
          <a href="tel:8442325575">844 232 5575</a>
        </div>
        <div className="hidden-sm">
          <div className="footer-address">
            <a href="https://www.google.com/maps/place/275+7th+Ave+%231705,+New+York,+NY+10011/@40.7455297,-73.9963182,17z/data=!3m1!4b1!4m5!3m4!1s0x89c259a537dbdaad:0x649ec638de307fd9!8m2!3d40.7455297!4d-73.9941242">
              <span>275 7th Avenue<br />#1705<br />NY, NY 10001</span>
            </a>
          </div>
        </div>
        <div className="hidden-sm">
          <Navigation />
        </div>
      </div>
    </section>
  );
}
