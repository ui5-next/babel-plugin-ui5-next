sap.ui.define("sample/ui/test/fixtures/view/actual", ["sap/ui/core/mvc/JSView", "sap/m/Page", "sap/m/Button"], function (JSView, Page, Button) {
  var _default = {};
  _default = Object.assign(sap.ui.jsview("sample.ui.test.fixtures.view.actual", {
    createContent: function (C) {
      return new Page({
        headerContent: new Button({
          icon: "sap-icon://hello-world",
          press: () => {
            this.oController.getOwnerComponent().openHelloDialog();
          }
        }),
        content: [new JSView({
          viewName: "sample.ui.components.HelloPanel"
        }), new JSView({
          viewName: "sample.ui.components.InvoiceList"
        })]
      });
    },
    getControllerName: function () {
      return "sample.ui.test.fixtures.view.actual";
    }
  }) || {}, _default);
  return _default;
})