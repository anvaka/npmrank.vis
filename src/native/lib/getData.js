/**
 * The first date in the undelying data source is two days behind. Removing it
 * from consideration
 */
var data = require('../../../data/compacted.js');

data.dates.shift();

Object.keys(data.packages).forEach(removeFirstDate);

function removeFirstDate(pkgName) {
  data.packages[pkgName].shift();
}

module.exports = data;
