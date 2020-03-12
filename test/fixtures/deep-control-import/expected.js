"use strict";

sap.ui.define("babel/test/test/fixtures/deep-control-import/actual", ["sap/ui/JSView", "babel/test/test/fixtures/deep-control-import/table"], function (JSView, MonacoEditor) {
  var _default = {};
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
  _default = Object.assign(AView, _default);
  return _default;
})