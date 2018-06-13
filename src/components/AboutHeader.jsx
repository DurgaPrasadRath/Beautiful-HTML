import React from 'react';

import video_about_mp4 from '../videos/about.mp4';
import video_about_webm from '../videos/about.webm';

export default function AboutHeader() {
  return (
    <div className="about-header">
      <div className="about-header-image">
        <div className="about-header-image-line"/>
        <div className="about-header-image-pixel"/>
        <div className="about-header-image-cbre"/>
      </div>
      <div className="section-wrapper section-large">
        <div className="about-header-video">
          <video autoPlay loop muted playsInline preload='auto'>
            <source src={video_about_mp4} type="video/mp4" />
            <source src={video_about_webm} type="video/webm" />
          </video>
          <video autoPlay loop muted playsInline preload='auto'>
            <source src={video_about_mp4} type="video/mp4" />
            <source src={video_about_webm} type="video/webm" />
          </video>
        </div>
        <div className="about-header-text">
          <p className="large-text">CBRE Build is a tech team located deep in the heart of Earth’s biggest commercial real estate company.</p>
          <p>We are a small team of diverse background and skill: engineers, designers, managers, researchers, thinkers, jokesters, and do-gooders inventing the future of an enormous industry with a long, rich past. From just a few offices around the planet, we are changing the way people relate to the spaces that stage their lives.</p>
        </div>
      </div>
    </div>
  );
}
