/**
 * Supposed to be called from ./builddata.sh
 * Parses 01.most-dependent-upon.md file and dumps json object to console:
 * {
 *   date:  date when the file was generated
 *   packages: hash dictionary with key being a package name, value - number of dependents
 * }
 */
var path = require('path');
var fs = require('fs');
var fileName = path.join(__dirname, '8e8fa57c7ee1350e3491', '01.most-dependent-upon.md');
if (!fs.existsSync(fileName)) {
  return;
}
var content = fs.readFileSync(fileName, 'utf8').split('\n');

var metrics = {
  packages: {}
};

content.forEach(parseLine);
console.log(JSON.stringify(metrics));
return;

function parseLine(line) {
  if (line[0] === '*') {
    tryParseDate(line);
  } else {
    tryParseStat(line);
  }
}

function tryParseDate(line) {
  var match = line.match(/^\* Date: (.+)$/);
  if (match) {
    metrics.date = new Date(match[1]);
  }
}

function tryParseStat(line) {
  var match = line.match(/^\d+\. \[(.+)\].+ - (\d+)$/);
  if (!match) return;

  metrics.packages[match[1]] = match[2];
}
