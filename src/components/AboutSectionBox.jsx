import React from 'react';

export default function AboutSectionBox(data) {
  const { section } = data;
  const direction = data.order % 2 === 0 ? 'right' : 'left';

  if (direction === 'right') {
    return (
      <div className="about-section caption-right">
        <div className="about-video">
          <video autoPlay loop muted playsInline preload='auto' poster={section.image}>
            <source src={section.video_mp4} type="video/mp4" />
            <source src={section.video_webm} type="video/webm" />
            <image src={section.image} />
          </video>
        </div>
        <div className="about-caption section-content">
          <div className="content-head">{section.title}<br />—</div>
          <p>{section.text}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="about-section caption-left">
      <div className="about-caption section-content">
        <div className="content-head">{section.title}<br />—</div>
        <p>{section.text}</p>
      </div>
      <div className="about-video">
        <video autoPlay loop muted playsInline preload='auto' poster={section.image}>
          <source src={section.video_mp4} type="video/mp4" />
          <source src={section.video_webm} type="video/webm" />
          <image src={section.image} />
        </video>
      </div>
    </div>
  );
}
