"use strict";

sap.ui.define("babel/test/test/fixtures/compile-ui5-jsview/actual", ["sap/ui/core/mvc/JSView", "sap/m/Page", "sap/m/Button"], function (JSView, Page, Button) {
  var _default = {};
  var App = {
    createContent: function createContent(controller) {
      var _this = this;

      this.addStyleClass(controller.getOwnerComponent().getContentDensityClass());
      return new Page({
        title: "{i18n>appTitle}",
        headerContent: new Button({
          icon: "sap-icon://hello-world",
          press: function press() {
            _this.oController.getOwnerComponent().openHelloDialog();
          }
        }),
        content: [new JSView({
          viewData: {
            extra: "this_is_a_test_string"
          },
          viewName: "babel.test.test.fixtures.compile-ui5-jsview.HelloPanel"
        }), new JSView({
          viewData: {},
          viewName: "babel.test.test.fixtures.compile-ui5-jsview.InvoiceList"
        })]
      });
    },
    getControllerName: function getControllerName() {
      return "sap.ui.core.mvc.Controller";
    }
  };
  App = sap.ui.jsview("babel.test.test.fixtures.compile-ui5-jsview.actual", App) || App;
  _default = Object.assign(App, _default);
  return _default;
})