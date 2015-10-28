var data = require('./lib/getData.js');
var barPlane = require('./lib/bar-plane.js');
var createScene = require('./lib/scene.js');
var App = require('../events/App.js');

module.exports = createNativeObjects;

function createNativeObjects() {
  var scene = createScene();
  var plane = barPlane(scene);

  window.addEventListener('keydown', onKeyDown, false);
  App.on('advance', advance);

  function onKeyDown(e) {
    if (e.which === 32) {
      data.advanceDate(e.shiftKey ? -1 : 1);
    }
  }

  function advance(delta) {
    data.advanceDate(delta);
  }
}
