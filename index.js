var THREE = require('three');
var data = require('./data/compacted.json');
var barPlane = require('./lib/bar-plane.js');

var scene = createScene();
var packages = require('./lib/packages.js')(data.packages);
var sliceIdx = 0;
var firstSlice = packages.getSliceAt(sliceIdx);
var plane = barPlane(scene, firstSlice);

window.addEventListener('keydown', onKeyDown, false);

function onKeyDown(e) {
  if(e.which === 32) {
    if (e.shiftKey) {
      if (sliceIdx === 0) sliceIdx = data.dates.length;
      sliceIdx -= 1;
    } else {
      sliceIdx += 1;
      if (sliceIdx >= data.dates.length) sliceIdx = 0
    }
    plane.render(packages.getSliceAt(sliceIdx));
  }
}

function createScene() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var fly = require('three.fly');
  var controls = fly(camera, document.body, THREE);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);

  camera.position.z = 5;

  render();
  return scene;

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function render() {
    requestAnimationFrame(render);

    controls.update(1);
    renderer.render(scene, camera);
  }
}
