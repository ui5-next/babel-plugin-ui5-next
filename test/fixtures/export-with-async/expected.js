"use strict";

sap.ui.define("babel/test/test/fixtures/export-with-async/actual", [], function () {
  var _default = {};

  var fetchCurrentUserInformation = async function fetchCurrentUserInformation() {
    var res = await fetch("/api/v1/user/");
    var body = await res.json();
    return body;
  };

  _default = Object.assign({
    fetchCurrentUserInformation: fetchCurrentUserInformation
  }, _default);
  return _default;
})