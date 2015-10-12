/**
 * defines mapping between App events and view model fields
 */
var App = require('../events/App.js');
var createViewModel = require('./lib/createViewModel.js');
var data = require('../native/lib/getData.js');

module.exports = mainViewModel();

function mainViewModel() {
  var vm = createViewModel();
  var lastHoveredIndex;

  App.on('hover', setHovered);
  App.on('dateChanged', setDateAndHover);

  return vm;

  function setDateAndHover(sliceIdx) {
    vm.set('date', data.getDateAtIndex(sliceIdx));

    if (lastHoveredIndex !== undefined) {
      setHovered(lastHoveredIndex);
    }
  }

  function setHovered(index) {
    lastHoveredIndex = index;
    var pkg = data.getPackageAtIndex(index);
    vm.set('hovered', pkg);
  }
}
