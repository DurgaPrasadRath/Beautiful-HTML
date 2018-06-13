import React from 'react';

//favicon assets
import appleTouchIcon from './assets/favicon/apple-touch-icon.png';
import favicon32 from './assets/favicon/favicon-32x32.png';
import favicon16 from './assets/favicon/favicon-16x16.png';
import safariPinnedTab from './assets/favicon/safari-pinned-tab.svg';

const themeColor = "#00ff44";

let stylesStr;
if (process.env.NODE_ENV === 'production') {
  try {
    stylesStr = require('!raw-loader!../public/styles.css');
  } catch (e) {
    console.log(e);
  }
}

const HeadLink = (props) => {
  return (
    <link
      rel = { props.rel }
      sizes = { props.sizes }
      href = { props.href }
      type = { props.type }
      color = { props.color }
    />
  )
}

const MetaTag = (props) => {
  return (
    <meta name={props.name} content={themeColor} />
  )
}

module.exports = class HTML extends React.Component {
  render() {
    let css;
    if (process.env.NODE_ENV === 'production') {
      css = (
        <style
          id="gatsby-inlined-css"
          dangerouslySetInnerHTML={{ __html: stylesStr }}
        />
      );
    }
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <HeadLink rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
          <HeadLink rel="icon" sizes="32x32" type="image/png" href={favicon32} />
          <HeadLink rel="icon" sizes="16x16" type="image/png" href={favicon16} />
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <MetaTag name="msapplication-TileColor" content="#00ff44" />
          <MetaTag name="theme-color" content="#00ff44" />
          {this.props.headComponents}
          {css}
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
};
