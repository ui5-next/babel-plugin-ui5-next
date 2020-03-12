"use strict";

sap.ui.define("babel/test/test/ts-fixtures/compile-ts-ui5-component/actual", ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "babel/test/test/ts-fixtures/compile-ts-ui5-component/manifest"], function (UIComponent, JSONModel, manifest) {
  var manifest = manifest.manifest;
  var _default = {};
  var Component = UIComponent.extend("babel.test.test.ts-fixtures.compile-ts-ui5-component.actual", {
    metadata: {
      manifest: manifest
    },
    init: function init() {
      UIComponent.prototype.init.apply(this, [this, arguments]);
      var oData = {
        recipient: {
          name: "World"
        }
      };
      var oModel = new JSONModel(oData);
      this.setModel(oModel);
      this.getRouter().initialize();
    }
  });
  _default = Object.assign(Component, _default);
  return _default;
})