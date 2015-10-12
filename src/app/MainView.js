import React from 'react';
import createComponent from './lib/createComponent.js';

import HoverDetails from './HoverDetails.js';

export default createComponent(model => (
  <div>
    <h1>npm growth rate (top 1k packages)</h1>
    {
      model.showHelp ?
        <span className='help'>Press spacebar to advance date</span> :
      (
        <HoverDetails model={model} />
      )
    }
  </div>
));
