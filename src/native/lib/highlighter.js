/**
 * Creates an object that knows how to highlight a single MeshBasicMaterial
 * One highlighter can highlight only one element at a time.
 */
module.exports = createHighlighter;

function createHighlighter(defaultColor) {
  var lastShape;
  var lastColor;

  highlight.clear = clear;
  return highlight;

  function highlight(shape, newColor) {
     if (lastShape) { clear(); }
     lastColor = shape.material.color.getHex();
     lastShape = shape;
     shape.material.color.setHex(newColor || defaultColor);
  }

  function clear() {
    if (!lastShape) return;
    lastShape.material.color.setHex(lastColor);
  }
}
