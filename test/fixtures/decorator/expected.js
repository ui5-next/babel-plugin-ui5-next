"use strict";

sap.ui.define("babel/test/test/fixtures/decorator/actual", ["sap/ui/JSView", "sap/m/Button"], function (JSView, Button) {
  var _default = {};

  var connect = function connect(target) {
    return target;
  };

  var highConnect = function highConnect(value) {
    return function () {
      return value;
    };
  };

  var AView = highConnect(1)(connect({
    init: function init() {
      JSView.prototype.init.apply(this, []);
    },
    onPress: function onPress() {// do nothing
    },
    createContent: function createContent() {
      return new Button({
        onPress: this.onPress,
        text: "\n        Text Here\n      "
      }).addStyleClass("btnClass1");
    },
    getControllerName: function getControllerName() {
      return "custom.Controller";
    }
  }));
  AView = sap.ui.jsview("babel.test.test.fixtures.decorator.actual", AView) || AView;
  _default = Object.assign(AView, _default);
  return _default;
})