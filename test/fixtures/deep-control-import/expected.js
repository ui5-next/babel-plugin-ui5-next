"use strict";

sap.ui.define("babel/test/test/fixtures/deep-control-import/actual", ["sap/ui/JSView", "babel/test/test/fixtures/deep-control-import/table"], function (JSView, MonacoEditor) {
  var _default = {};

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  var AView = {
    onPress: function onPress() {// do nothing
    },
    createEditor: function createEditor() {
      return new MonacoEditor({});
    },
    getControllerName: function getControllerName() {
      return "sap.ui.core.mvc.Controller";
    }
  };
  AView = sap.ui.jsview("babel.test.test.fixtures.deep-control-import.actual", AView) || AView;
  _default = _extends(AView, _default);
  return _default;
})