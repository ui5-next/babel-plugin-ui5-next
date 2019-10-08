"use strict";

sap.ui.define("babel/test/test/ts-fixtures/compile-ts-ui5-component/actual", ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "babel/test/test/ts-fixtures/compile-ts-ui5-component/manifest"], function (UIComponent, JSONModel, manifest) {
  var manifest = manifest.manifest;
  var _default = {};

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
  _default = _extends(Component, _default);
  return _default;
})