var THREE = require('three');
var data = require('./lib/getData.js');
var barPlane = require('./lib/bar-plane.js');
var createScene = require('./lib/scene.js');
var App = require('../events/App.js');

module.exports = createNativeObjects;

function createNativeObjects() {
  var scene = createScene();
  // TODO: should be separate chunk?
  var packages = require('./lib/packages.js')(data.packages);
  var sliceIdx = 0;
  var firstSlice = packages.getSliceAt(sliceIdx);
  var plane = barPlane(scene, firstSlice);

  // setInterval(function() {
  //   advanceSlice(1);
  // }, 300);
  window.addEventListener('keydown', onKeyDown, false);

  function onKeyDown(e) {
    if (e.which === 32) {
      if (e.shiftKey) {
        advanceSlice(-1);
      } else {
        advanceSlice(1);
      }
    }
  }

  function advanceSlice(diff) {
    sliceIdx += diff;
    var reset = false;
    if (sliceIdx >= data.dates.length) {
      sliceIdx = 0;
      reset = true;
    } else if (sliceIdx < 0) {
      sliceIdx = data.dates.length - 1;
    }
    var slice = packages.getSliceAt(sliceIdx);
    plane.render(slice, reset);

    App.fire('dateChanged', data.dates[sliceIdx]);
  }
}
