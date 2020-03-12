"use strict";

sap.ui.define("babel/test/test/fixtures/jsview-import/actual", ["sap/ui/core/mvc/JSView"], function (JSView) {
  var _default = {};
  var AView = {
    createContent: function createContent() {
      return new JSView({
        viewData: {
          data: 1
        },
        viewName: "babel.test.test.fixtures.jsview-import.HomePage"
      });
    },
    getControllerName: function getControllerName() {
      return "sap.ui.core.mvc.Controller";
    }
  };
  AView = sap.ui.jsview("babel.test.test.fixtures.jsview-import.actual", AView) || AView;
  _default = Object.assign(AView, _default);
  return _default;
})