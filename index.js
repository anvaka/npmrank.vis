var THREE = require('three');
var data = require('./data/compacted.json');
var barPlane = require('./lib/bar-plane.js');
var createScene = require('./lib/scene.js');

var scene = createScene();
var packages = require('./lib/packages.js')(data.packages);
var sliceIdx = 0;
var firstSlice = packages.getSliceAt(sliceIdx);
var plane = barPlane(scene, firstSlice);

window.addEventListener('keydown', onKeyDown, false);

function onKeyDown(e) {
  if (e.which === 32) {
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
