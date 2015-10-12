import React from 'react';
import createComponent from './lib/createComponent.js';

export default createComponent(model => {
  let className = '';
  if (model.value > 0) {
    className = 'trend-up';
  } else if (model.value < 0) {
    className = 'trend-down';
  }
  return (
    <div className='trend-info'>
      <h3>{model.key} <span className={className}>{model.value}</span>
      </h3>
    </div>
  );
});
