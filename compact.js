/**
 * Supposed to be called from ./builddata.sh
 * Parses result of ./collect.js and prints object with change rate of packages
 * {
 *   dates: [ array of dates in the data set]
 *   packages: {
 *     hash of packages, where key is a package name,
 *     value is array of numbers. i-th number gives a value for the i-th date
 *   }
 */
var inputFile = require('./data/points.js');

var dates = readDates(inputFile);
var packages = createPackages(inputFile, dates);

var result = {
  dates: dates.array,
  packages: packages
};

console.log(JSON.stringify(result));

function createPackages(inputFile, dates) {
  var totalValues = dates.array.length;
  var packages = Object.create(null);
  inputFile.forEach(recordPackage);

  return packages;

  function recordPackage(x) {
    var valueIndex = dates.getIndex(x.date);
    Object.keys(x.packages).forEach(addPackage);

    function addPackage(pkgName) {
      var values = packages[pkgName];
      if (!values) {
        values = packages[pkgName] = createArray(totalValues);
      }

      values[valueIndex] = x.packages[pkgName];
    }
  }
}

function createArray(count) {
  return new Array(count).join('-').split('-');
}

function readDates(inputFile) {
  var dates = [];
  inputFile.forEach(recordDate);
  dates = dates.sort(byAscendingDate);
  var lookup = new Map();
  dates.forEach(addToLookup);

  return {
    array: dates,
    getIndex: getIndex
  };

  function getIndex(x) {
    return lookup.get(x);
  }

  function recordDate(x) {
    dates.push(x.date);
  }

  function byAscendingDate(x, y) {
    return (new Date(x)) - (new Date(y));
  }

  function addToLookup(date, index) {
    lookup.set(date, index);
  }
}
