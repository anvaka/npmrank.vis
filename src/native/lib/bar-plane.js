var THREE = require('three');
var TWEEN = require('tween.js');
var App = require('../../events/App.js');
var data = require('./getData.js');

var createAudioEgg = require('./audio.js');
var createHighlighter = require('./highlighter.js');

module.exports = createPlane;

function createPlane(scene) {
  var lastChanges = data.getCurrentDateChanges();

  // List of all three.js box meshes:
  var boxes = [];
  // Maps three.js Object3D.id to the package index within current changes.
  var idToIndex = {};
  // We render each package within a square with side length equal to `size`
  var size = Math.ceil(Math.sqrt(lastChanges.length));

  // Each cube is padded by this value
  var padding = 2;

  // Each box share the same geometry. We use mesh.scale transform to change height value:
  var boxGeometry = new THREE.BoxGeometry(1, 1, 1);

  // When user moves mouse we want to highlight hovered box:
  var highlight = createHighlighter(0xff0000);

  initialize(lastChanges);

  // Easter egg: Drop audio file.
  var isAudioReady = false;
  var audio = createAudioEgg();
  var kittenThere = false;
  audio.on('ready', setAudioReady);

  return; // Public API is over here.

  function setAudioReady() {
    isAudioReady = true;
  }

  function initialize(changes) {
    addAllBoxes(changes);
    centerCameraOnScene();

    scene.on('mouseover', highlightOver);
    scene.on('render', raf);
    App.on('dateChanged', updateChart);
  }

  function raf() {
    if (isAudioReady) {
      updateAudioImpact();
    }
  }

  function updateAudioImpact() {
    var frequency = audio.getByteFrequency();
    var length = frequency.length;
    var boxesLength = boxes.length;
    var boxesPerWave = Math.ceil(boxesLength/length);

    var color = new THREE.Color();

    for (var i = 0; i < length; i++) {
      var freqValue = frequency[i];
      var offset = i * boxesPerWave;
      for (var j = 0; j < boxesPerWave; j++) {
        var boxIndex = offset + j;
        color.setHSL(freqValue/255, 1, 0.5);
        setBoxColor(boxIndex, color.getHex());
      }
    }
  }

  function updateChart(index) {
    var changes = data.getCurrentDateChanges();
    render(changes, index === 0);
    if (isAudioReady && (index % 5 === 0)) {
      showKitten();
    }
  }

  function showKitten() {
    if (kittenThere) return;
    var container = document.getElementById('three-root');
    var img = new Image();
    img.classList.add('kitten');
    img.src = 'https://raw.githubusercontent.com/anvaka/npmrank.vis/master/images/meow.gif';
    container.appendChild(img);
    kittenThere = true;
  }

  function highlightOver(shape) {
    var packageIndex = idToIndex[shape.id];
    if (packageIndex === undefined) return; // probably not a box?

    highlight(shape);

    App.fire('hover', packageIndex);
  }

  function addAllBoxes(changes) {
    var idx = 0;
    var minMax = getMinMax(changes);

    for (var i = 0; i < changes.length; ++i) {
      var value = changes[i].value;
      var color = getColor(value, minMax.min, minMax.max);
      addBox(i, value, color);
    }
  }

  function centerCameraOnScene() {
    var half = size * padding / 2;
    var camera = scene.three.camera;
    camera.position.x += half;
    camera.position.y += half;
    var boxWidth = 2.15 * size * padding;
    camera.position.z = boxWidth / 2 / Math.tan(Math.PI * camera.fov / 360);
  }

  function render(changes, reset) {
    lastChanges = changes;

    var minMax = getMinMax(changes);
    for (var i = 0; i < changes.length; ++i) {
      var value = changes[i].value;
      var attachedToScene = boxes[i].parent;
      if (value === 0 && attachedToScene && !reset) {
        scene.three.scene.remove(boxes[i]);
      } else if ((value !== 0 || reset) && !attachedToScene) {
        scene.three.scene.add(boxes[i]);
      }
      var color = getColor(value, minMax.min, minMax.max);
      updateBox(i, value, color);
    }
  }

  function setBoxColor(i, color) {
    var box = boxes[i];
    if (box) box.material.color.setHex(color);
  }

  function updateBox(i, height, color) {
    height = height || 1;
    var cube = boxes[i];
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
    var material = new THREE.MeshBasicMaterial({
      color: color
    });

    var cube = new THREE.Mesh(boxGeometry, material);
    height = height || 1;
    cube.scale.z = height;
    cube.position.set(x * padding, y * padding, height / 2);
    scene.three.scene.add(cube);
    boxes[i] = cube;
    idToIndex[cube.id] = i;
  }
}

function getColor(value, min, max) {
  if (min === max) {
    return 0xcccccc;
  }
  if (value === 0) return 0x0;

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

function getMinMax(changes) {
  var min = Number.POSITIVE_INFINITY;
  var max = Number.NEGATIVE_INFINITY;

  for (var i = 0; i < changes.length; ++i) {
    var val = changes[i].value;
    if (val < min) min = val;
    if (val > max) max = val;
  }

  return {
    min: min,
    max: max
  };
}

function rainbow() {
  var arr = [0xFF0000,
    0xFF7F00,
    0xFFFF00,
    0xffffff,
    0x00FF00,
    0x0000FF,
    0x4B0082,
    0xffffff,
    0xffffff,
    0x8B00FF
  ];
  return arr[Math.random() * arr.length | 0];
}
