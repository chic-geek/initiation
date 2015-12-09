(function() {

  // moduleName based on data-attr:
  var _moduleName = '';

  // the initialize function:
  function _runModule() {

  }

  // check to see if module is in the DOM before initializing:
  var _runElement = $('[data-module~="' + _moduleName + '"]');
  if (_runElement.length > 0) { _runModule(); }
})();
