"use strict";

sap.ui.define("babel/test/test/fixtures/es6-to-ui5-module/actual", ["babel/test/test/fixtures/es6-to-ui5-module/test", "sap/ui/Device"], function (test, Deivce) {
  var sample = test.sample;
  var _default = {};
  var A = 1;
  _default.A = A;
  _default = Object.assign(sample(Deivce), _default);
  return _default;
})