"use strict";

sap.ui.define("babel/test/test/fixtures/es6-to-ui5-module/actual", ["./test", "sap/ui/Device"], function (test, Deivce) {
  var sample = test.sample;
  var _default = {};

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  var A = _default.A = 1;
  _default = _extends(sample(Deivce), _default);
  return _default;
})