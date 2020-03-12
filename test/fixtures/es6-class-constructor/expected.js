"use strict";

sap.ui.define("babel/test/test/fixtures/es6-class-constructor/actual", ["sap/ui/JSView", "sap/m/Button"], function (JSView, Button) {
  var _default = {};
  var AView = {
    constructor: function constructor(v) {
      this._v = v;
      new Button();
    },
    getControllerName: function getControllerName() {
      return "sap.ui.core.mvc.Controller";
    }
  };
  AView = sap.ui.jsview("babel.test.test.fixtures.es6-class-constructor.actual", AView) || AView;
  _default = Object.assign(AView, _default);
  return _default;
})