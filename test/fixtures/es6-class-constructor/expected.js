"use strict";

sap.ui.define("babel/test/test/fixtures/es6-class-constructor/actual", ["sap/ui/JSView", "sap/m/Button"], function (JSView, Button) {
  var _default = {};

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
  _default = _extends(AView, _default);
  return _default;
})