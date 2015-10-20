/**
 * defines mapping between App events and view model fields
 */
var App = require('../events/App.js');
var moment = require('moment');
var createViewModel = require('./lib/createViewModel.js');
var data = require('../native/lib/getData.js');

module.exports = mainViewModel();

function mainViewModel() {
  var vm = createViewModel();
  var lastHoveredIndex;
  vm.showHelp = true;

  App.on('hover', setHovered);
  App.on('dateChanged', setDateAndHover);

  return vm;

  function setDateAndHover(dateIndex) {
    vm.showHelp = dateIndex === 0;
    var date = data.getDateAtIndex(dateIndex);
    vm.set('date', formatDate(date));

    if (lastHoveredIndex !== undefined) {
      setHovered(lastHoveredIndex);
    }
  }

  function setHovered(index) {
    lastHoveredIndex = index;
    var pkg = data.getPackageAtIndex(index);
    var str;
    if (pkg.value > 0) {
      str = '+' + pkg.value.toString(10);
    } else if (pkg.value < 0) {
      str = pkg.value.toString(10);
    } else {
      str = pkg.value.toString(10);
    }

    vm.set('hovered', {
      total: formatNumber(data.getTotalDeps(index)),
      change: str,
      name: pkg.key
    });
  }
}

function formatNumber(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(x) {
  return moment(x).format('dddd, MMMM Do YYYY');
}
