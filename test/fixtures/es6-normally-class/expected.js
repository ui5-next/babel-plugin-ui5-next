"use strict";

sap.ui.define("babel/test/test/fixtures/es6-normally-class/actual", ["react"], function (react) {
  var Component = react.Component;
  var _default = {};

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  export class C extends Component {}

  class AView {
    v() {}

  }

  _default = _extends(AView, _default);
  return _default;
})