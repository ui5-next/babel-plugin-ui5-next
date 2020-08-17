"use strict";

sap.ui.define("babel/test/test/fixtures/es6-normally-class/actual", ["react"], function (react) {
  var Component = react.Component;
  var _default = {};
  var C = Component.extend("babel.test.test.fixtures.es6-normally-class.actual", {});
  _default.C = C;
  var AView = sap.ui.base.Object.extend("babel.test.test.fixtures.es6-normally-class.actual", {
    v: function v() {}
  });
  _default = Object.assign(AView, _default);
  return _default;
})