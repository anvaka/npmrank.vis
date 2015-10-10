var THREE = require('three');
var TWEEN = require('tween.js');
var createHighlighter = require('./highlighter.js');

module.exports = createPlane;

function createPlane(scene, initialSlice) {
  var boxes = [];
  var idToIndex = {};
  var size = Math.ceil(Math.sqrt(initialSlice.length));
  var squareMultiplier = 2;

  var highlight = createHighlighter(0xff0000);
  var lastSlice;
  initialize(initialSlice);

  return {
    render: render
  }

  function initialize(slice) {
    lastSlice = slice;
    addAllBoxes(slice);
    centerCameraOnScene();
    scene.on('mouseover', highlightOver);
  }

  function highlightOver(shape) {
    var boxIndex = idToIndex[shape.id];
    if (boxIndex === undefined) return; // probably not a box?
    highlight(shape);
    console.log(lastSlice[boxIndex].key);
    // TODO: emit to the UI.
  }

  function addAllBoxes(slice) {
    var idx = 0;
    var minMax = getMinMax(slice);

    for (var i = 0; i < slice.length; ++i) {
      var value = slice[i].value;
      var color = getColor(value, minMax.min, minMax.max);
      addBox(i, value, color);
    }
  }

  function centerCameraOnScene() {
    var half = size * squareMultiplier / 2;
    var camera = scene.three.camera;
    camera.position.x += half;
    camera.position.y += half;
    var boxWidth = 1.15 * size * squareMultiplier;
    camera.position.z = boxWidth / 2 / Math.tan(Math.PI * camera.fov / 360);
  }

  function render(slice) {
    lastSlice = slice;

    var minMax = getMinMax(slice);
    for (var i = 0; i < slice.length; ++i) {
      var value = slice[i].value;
      var color = getColor(value, minMax.min, minMax.max);
      updateBox(i, value, color);
    }
  }

  function updateBox(i, height, color) {
    height = height || 1;
    var cube = boxes[i];
    // todo: size should be optional
    cube.material.color.setHex(color);
    var from = {
      scale: cube.scale.z,
      height: cube.position.z
    };
    var to = {
      scale: height,
      height: height / 2
    };

    var tween = new TWEEN.Tween(from)
      .to(to, 100)
      .onUpdate(setCubePosition)
      .start();

    function setCubePosition() {
      cube.scale.z = this.scale;
      cube.position.z = this.height;
    }
  }

  function addBox(i, height, color) {
    var x = i % size;
    var y = (i / size) | 0;
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    var cube = new THREE.Mesh(geometry, material);
    height = height || 1;
    cube.scale.z = height;
    cube.position.set(x * squareMultiplier, y * squareMultiplier, height / 2);
    scene.three.scene.add(cube);
    boxes[i] = cube;
    idToIndex[cube.id] = i;
  }
}

function getColor(value, min, max) {
  if (min === max) {
    return 0xcccccc;
  }
  var h;
  if (value < 0) {
    // pick from 160 ... 240 spectrum of hue value
    var diff = value / min;
    h = 160 + (240 - 160) * diff;
  } else {
    // pick from 0 to 160 of the hue spectrum, where 0 === max
    var diff = 1 - value / max;
    h = 160 * diff;
  }
  var color = new THREE.Color('hsl(' + (h / 360) + ', 100%, 50%)');
  return color.getHex();
}

function getMinMax(slice) {
  var min = Number.POSITIVE_INFINITY;
  var max = Number.NEGATIVE_INFINITY;

  for (var i = 0; i < slice.length; ++i) {
    var val = slice[i].value;
    if (val < min) min = val;
    if (val > max) max = val;
  }

  return {
    min: min,
    max: max
  };
}
