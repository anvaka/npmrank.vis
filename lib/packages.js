module.exports = createPackages;

function createPackages(src) {
  var names = Object.keys(src);
  var api = {
    getSliceAt: getSliceAt
  };
  return api;

  function getSliceAt(idx) {
    var slice = [];
    names.forEach(add);
    return slice;

    function add(id) {
      if (idx === 0) {
        slice.push({
          key: id,
          value: 0
        });
        return;
      }
      var currentValue = src[id][idx];
      var prevValue = src[id][idx - 1];
      if (currentValue === '' || prevValue === '') {
        slice.push({
          key: id,
          value: 0
        });
        return;
      }

      var diff = parseInt(currentValue, 10) - parseInt(prevValue, 10);

      slice.push({
        key: id,
        value: diff
      });
    }
  }
}
