import React from 'react';
import createComponent from './lib/createComponent.js';

import HoverDetails from './HoverDetails.js';

export default createComponent(model => (
  <div>
    <h2>{model.date}</h2>
    <HoverDetails model={model.hovered} />
  </div>
));
