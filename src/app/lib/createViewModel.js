var eventify = require('ngraph.events');
module.exports = createViewModel;

function createViewModel(fieldsMap, dispatcher) {
  var viewModel = eventify({
    dispose: dispose
  });
  var handlersMap = Object.create(null);

  Object.keys(fieldsMap).forEach(addMapping);

  return viewModel;

  function addMapping(eventName) {
    handlersMap[eventName] = setViewModelValue;
    dispatcher.on(eventName, setViewModelValue);

    function setViewModelValue(payload) {
      var viewModelTargetProperty = fieldsMap[eventName];
      viewModel[viewModelTargetProperty] = payload;
      // TODO: This doesn't have to be here. It could accumulated and fired
      // once per event loop cycle
      viewModel.fire('change');
    }
  }

  function dispose() {
    Object.keys(handlersMap).forEach(disposeHandler);
  }

  function disposeHandler(eventName) {
    dispatcher.off(eventName, handlersMap[eventName]);
  }
}
