"use strict";

sap.ui.define("babel/test/test/fixtures/es6-normally-class/actual", ["react"], function (react) {
  var Component = react.Component;
  var _default = {};

  class C extends Component {}

  _default.C = C;

  class AView {
    v() {}

  }

  _default = Object.assign(AView, _default);
  return _default;
})