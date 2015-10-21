import React from 'react';
import createComponent from './lib/createComponent.js';

import HoverDetails from './HoverDetails.js';
import GlobalHelp from './GlobalHelp.js';

export default createComponent(model => (
  <div>
    <h1>npm growth rate (top 1k packages)</h1>
    {
      model.showHelp ?
        <span className='help-space'>Press spacebar to advance the date</span> :
      (
        <HoverDetails model={model} />
      )
    }
    <GlobalHelp isVisible={true}/>
  </div>
));
