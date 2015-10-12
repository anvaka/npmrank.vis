import React from 'react';
import createComponent from './lib/createComponent.js';

export default createComponent(model => {
  let hoveredPackage = getHoveredView(model.hovered);

  return (
    <div className='trend-info'>
      <h2>{model.date}</h2>
      {hoveredPackage}
    </div>
  );
});

function getHoveredView(model) {
  if (!model) return null;

  let className = '';
  if (model.change[0] === '+' ) {
    className = 'up';
  } else if (model.change[0] === '-') {
    className = 'down';
  }
  return (
    <h3>
      <a href={'https://www.npmjs.com/package/' + model.name} target='_blank'>{model.name}</a>:
      <span className={'trend ' + className}>{model.change}</span>
      <span className='total'>(total: {model.total})</span>
    </h3>
  );
}
