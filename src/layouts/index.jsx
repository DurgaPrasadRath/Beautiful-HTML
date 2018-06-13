import React from 'react';
import 'prismjs/themes/prism-solarizedlight.css';

const Template = props => (
  <div>
    {props.children()}
  </div>
);

export default Template;
