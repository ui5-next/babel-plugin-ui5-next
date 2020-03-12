"use strict";

sap.ui.define("babel/test/test/fixtures/es6-class-to-ui5-class/actual", ["sap/ui/JSView", "sap/m/Button"], function (JSView, Button) {
  var _default = {};
  var AView = {
    init: function init() {
      JSView.prototype.init.apply(this, []);
    },
    onPress: function onPress() {// do nothing
    },
    createContent: function createContent() {
      return new Button({
        onPress: this.onPress.bind(this),
        text: "Text Here"
      }).addStyleClass("btnClass1");
    },
    getControllerName: function getControllerName() {
      return "custom.Controller";
    }
  };
  AView = sap.ui.jsview("babel.test.test.fixtures.es6-class-to-ui5-class.actual", AView) || AView;
  _default = Object.assign(AView, _default);
  return _default;
})