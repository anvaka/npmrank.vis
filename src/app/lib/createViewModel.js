var eventify = require('ngraph.events');
module.exports = createViewModel;

function createViewModel(fieldsMap) {
  var viewModel = eventify({
    set: set
  });

  return viewModel;

  function set(property, value) {
    viewModel[property] = value;
    viewModel.fire('change');
  }
}
