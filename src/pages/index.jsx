import React from 'react';
import Link from 'gatsby-link';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogBox from '../components/BlogBox';
import JobBox from '../components/JobBox';
import FlashyLink from '../components/FlashyLink';

import '../styles/photon_theme_styles/main.scss';
import '../styles/photon_theme_styles/custom.scss';
import '../styles/main.styl';

export default function Index({ data }) {
  return (
    <div id="home">
      <Header />
      <div className="homepage-header">
        <div className="homepage-header-text">
          <h1>Hi, we’re <br/>CBRE Build.</h1>
        </div>
      </div>
      <div className="homepage-sub-header">
        <div className="sub-header-text">
          <h2>We’re a little tech team within a really big real estate company.</h2>
        </div>
        <div className="bottom-text">
          See who we are and what we care <FlashyLink content="about" to="/about" metaIndex="01" />
        </div>
      </div>
      <div className="homepage-section-3">
        <div className="products-bg"></div>
        <div className="products-image">
          <h2>We make tools for learning about the spaces where people work.</h2>
          <div className="bottom-text">Read about all of our <FlashyLink content="products" to="/products" metaIndex="02">products</FlashyLink></div>
        </div>
      </div>
      <div className="homepage-more-links row">
        <div><h2>See what we're up to<br/> on our <FlashyLink content="blog" to="/blog/1" metaIndex="03" /></h2></div>
        <div><h2>Build your <FlashyLink content="career" to="/careers" metaIndex="04" /> <span className="linebreak">with us</span></h2></div>
      </div>
      <Footer />
    </div>
  );
}
