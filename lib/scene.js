var fly = require('three.fly');
var eventify = require('ngraph.events');
var THREE = require('three');

module.exports = createScene;

function createScene() {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var lastIntersected;
  var needHitTest = false;

  var controls = fly(camera, document.body, THREE);

  listenToEvents();

  render();

  var api = {
    three: {
      scene: scene,
      camera: camera,
      renderer: renderer
    }
  }

  eventify(api);

  return api;

  function listenToEvents() {
    controls.on('move', onCameraMove);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
  }

  function onDocumentMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    needHitTest = true;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function render() {
    requestAnimationFrame(render);

    hitTest();
    controls.update(1);
    renderer.render(scene, camera);
  }

  function onCameraMove() {
    needHitTest = true;
  }

  function hitTest() {
    if (!needHitTest) {
      return;
    }
    needHitTest = false;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      if (lastIntersected !== intersects[0].object) {
        lastIntersected = intersects[0].object;
        api.fire('mouseover', intersects[0].object);
      }
    } else if (lastIntersected) {
      api.fire('mouseout', lastIntersected);
      lastIntersected = null;
    }
  }
}
