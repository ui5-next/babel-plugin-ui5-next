sap.ui.define("babel/test/test/fixtures/export-with-async/actual", [], function () {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _async(fn) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);try {
        return Promise.resolve(fn.apply(this, args));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }function _await(input, then, direct) {
    if (direct) {
      return typeof then === 'function' ? then(input) : input;
    }if (typeof then === 'function') {
      return Promise.resolve(input).then(then);
    } else {
      return Promise.resolve(input);
    }
  }var fetchCurrentUserInformation = _async(function () {
    return _await(fetch("/api/v1/user/"), function (res) {
      return _await(res.json());
    });
  });

  _default = _extends({
    fetchCurrentUserInformation: fetchCurrentUserInformation
  }, _default);
  return _default;
})