"use strict";

sap.ui.define("babel/test/test/fixtures/export-with-async/actual", [], function () {
  var _default = {};

  function _await(value, then, direct) {
    if (direct) {
      return then ? then(value) : value;
    }

    if (!value || !value.then) {
      value = Promise.resolve(value);
    }

    return then ? value.then(then) : value;
  }

  var fetchCurrentUserInformation = _async(function () {
    return _await(fetch("/api/v1/user/"), function (res) {
      return _await(res.json());
    });
  });

  function _async(f) {
    return function () {
      for (var args = [], i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }

      try {
        return Promise.resolve(f.apply(this, args));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  export { fetchCurrentUserInformation };
  return _default;
})