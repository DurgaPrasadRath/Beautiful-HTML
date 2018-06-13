import React from 'react';

export default function AboutSectionBox(data) {
  const { section } = data;
  const direction = data.order % 2 === 0 ? 'right' : 'left';

  const Caption = props => (
    <div className="product-caption section-content">
      <div className="content-head">{props.title}<br />—</div>
      <p>{props.text}</p>
      <p><a className="try-product-link" target="_blank" href={props.link}>{props.linkText}</a></p>
    </div>
  );

  const Video = (props) => {
    let vidRef;

    function onClick() {
      return vidRef.paused ? vidRef.play() : vidRef.pause();
    }

    return (
      <div className="product-video" onClick={onClick}>
        <div className="browser-frame" />
        <video loop muted playsInline preload="metadata" poster={props.image} ref={k => vidRef = k}>
          <source src={props.video} type="video/mp4" />
          <img src={props.image} />
        </video>
      </div>
    );
  };

  if (direction === 'right') {
    return (
      <div className="product-section caption-right">
        <Video video={section.video} image={section.image} />
        <Caption title={section.title} text={section.text} link={section.link} linkText={section.linkText}/>
      </div>
    );
  }

  return (
    <div className="product-section caption-left">
      <Caption title={section.title} text={section.text}  link={section.link} linkText={section.linkText}/>
      <Video video={section.video} image={section.image} />
    </div>
  );
}
