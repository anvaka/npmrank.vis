/**
 * Provides high level access to the "database" of npm growth rate. Currently
 * database is a simple json file, which is generated by builddata.sh script.
 */

// TODO: should this json file be a separate chunk?
var data = require('../../../data/compacted.js');
var App = require('../../events/App.js');

// All dates, but the first one have ~24 hours difference between them.
// This wil remove the first date from the dataset to avoid confusion.
removeFirstDate();

module.exports = createDataAccess();

function createDataAccess() {
  var api = {
    getDateAtIndex: getDateAtIndex,
    getPackageAtIndex: getPackageAtIndex,
    getTotalDeps: getTotalDeps,
    getChangesForDate: getChangesForDate,
    getCurrentDateChanges: getCurrentDateChanges,
    advanceDate: advanceDate
  };

  var dates = data.dates;
  var packages = data.packages;
  var names = Object.keys(packages).sort(byDepsCountOnFirstDay);
  var currentDateIdx = 0;
  var currentDate = getChangesForDate(currentDateIdx);

  return api;

  function getDateAtIndex(index) {
    return dates[index];
  }

  function getTotalDeps(index) {
    var pkgName = names[index];
    return packages[pkgName][currentDateIdx];
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

      var diff = parseFloat(currentValue) - parseFloat(prevValue);

      changes.push({
        key: id,
        value: diff
      });
    }
  }

  function byDepsCountOnFirstDay(x, y) {
    var dayX = packages[x][0];
    var dayY = packages[y][0];
    if (dayX === '' && dayY !== '') {
      return 1;
    } else if (dayX !== '' && dayY === '') {
      return -1;
    } else if (dayX === dayY) {
      return 0;
    }
    return parseFloat(dayY) - parseFloat(dayX);
  }
}

function removeFirstDate() {
  data.dates.shift();

  Object.keys(data.packages).forEach(removeFirstDate);

  function removeFirstDate(pkgName) {
    data.packages[pkgName].shift();
  }
}
