"use strict";

sap.ui.define("babel/test/test/fixtures/compile-ui5-jsview/actual", ["sap/ui/core/mvc/JSView", "sap/m/Page", "sap/m/Button"], function (JSView, Page, Button) {
  var _default = {};

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
  _default = _extends(App, _default);
  return _default;
})