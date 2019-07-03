"use strict";

sap.ui.define("babel/test/test/fixtures/jsx-support/actual", ["sap/ui/JSView", "sap/m/Button", "sap/m/HTML"], function (JSView, Button, HTML) {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var AView = {
    onPress: function onPress() {
      // do nothing
    },
    createPart: function createPart() {
      this._hideButton = new Button({
        name: "1"
      });
      return new HTML({
        content: [this._hideButton]
      });
    },
    createContent: function createContent() {
      return new Button({
        onPress: this.onPress.bind(this),
        text: "Text Here"
      }).addStyleClass("btnClass1");
    },
    getControllerName: function getControllerName() {
      return "sap.ui.core.mvc.Controller";
    }
  };
  AView = sap.ui.jsview("babel.test.test.fixtures.jsx-support.actual", AView) || AView;
  _default = _extends(AView, _default);
  return _default;
})