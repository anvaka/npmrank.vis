var THREE = require('three');
module.exports = createPlane;

function createPlane(scene, initialSlice) {
  var boxes = [];
  var size = Math.ceil(Math.sqrt(initialSlice.length));
  initialize(initialSlice);

  return {
    render: render
  }

  function initialize(slice) {
    var idx = 0;
    var minMax = getMinMax(slice);

    for (var i = 0; i < slice.length; ++i) {
      var value = slice[i].value;
      var color = getColor(value, minMax.min, minMax.max);
      addBox(i, value, color);
    }
  }

  function render(slice) {
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
    cube.scale.z = height;
    cube.position.z = height/2;
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
    cube.position.set(x * 2, y * 2, height / 2);
    scene.add(cube);
    boxes[i] = cube;
  }
}

function getColor(value, min, max) {
  if (min === max) {
    return 0xcccccc;
  }
  if (value < 0) {
    // pick from 160 ... 240 spectrum of hue value
    var diff = value/min;
    h = 160 + (240 - 160) * diff;
  } else {
    // pick from 0 to 160 of the hue spectrum, where 0 === max
    var diff = 1 - value/max;
    h = 160 * diff;
  }
  var color = new THREE.Color('hsl(' + (h/360) + ', 100%, 50%)');
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
