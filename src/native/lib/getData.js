// TODO: should be a separate chunk?
var data = require('../../../data/compacted.js');
var App = require('../../events/App.js');

removeFirstDate();

module.exports = createDataAccess();

function createDataAccess() {
  var api = {
    getDateAtIndex: getDateAtIndex,
    getPackageAtIndex: getPackageAtIndex,
    getChangesForDate: getChangesForDate,
    getCurrentDateChanges: getCurrentDateChanges,
    advanceDate: advanceDate
  };

  var dates = data.dates;
  var packages = data.packages;
  var names = Object.keys(packages);
  var currentDateIdx = 0;
  var currentDate = getChangesForDate(currentDateIdx);

  return api;

  function getDateAtIndex(index) {
    return dates[index];
  }

  function getCurrentDateChanges() {
    return currentDate;
  }

  function getPackageAtIndex(index) {
    return currentDate[index];
  }

  function advanceDate(diff) {
    currentDateIdx += diff;
    var reset = false;
    if (currentDateIdx >= data.dates.length) {
      currentDateIdx = 0;
    } else if (currentDateIdx < 0) {
      currentDateIdx = data.dates.length - 1;
    }

    currentDate = getChangesForDate(currentDateIdx);

    App.fire('dateChanged', currentDateIdx);
  }

  function getChangesForDate(idx) {
    var changes = [];
    names.forEach(add);
    return changes;

    function add(id) {
      if (idx === 0) {
        // At day 0 we have nothing to compare with. Assuming no changes there:
        changes.push({
          key: id,
          value: 0
        });
        return;
      }
      var currentValue = packages[id][idx];
      var prevValue = packages[id][idx - 1];
      if (currentValue === '' || prevValue === '') {
        // Probably this package isn't popular enough and was added somewhere
        // in the middle of the monitoring. We don't have previous (or current)
        // change data points, so we assume there is no change:
        changes.push({
          key: id,
          value: 0
        });
        return;
      }

      var diff = parseInt(currentValue, 10) - parseInt(prevValue, 10);

      changes.push({
        key: id,
        value: diff
      });
    }
  }
}

function removeFirstDate() {
  // The first date in the undelying data source is two days behind. Removing it
  // from consideration
  data.dates.shift();

  Object.keys(data.packages).forEach(removeFirstDate);

  function removeFirstDate(pkgName) {
    data.packages[pkgName].shift();
  }
}
