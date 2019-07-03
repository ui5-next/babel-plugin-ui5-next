sap.ui.define("babel/test/test/fixtures/complex-jsx-import/actual", ["sap/ui/JSView", "sap/m/Button", "sap/m/HTML", "babel/test/test/fixtures/complex-jsx-import/table"], function (JSView, Button, HTML, MonacoEditor) {
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
        value: React.createElement("div", { "class": "nameStyle" }),
        content: [this._hideButton]
      }).addStyleClass("htmlStyle");
    },
    createContent: function createContent() {
      return new Button({
        onPress: this.onPress.bind(this),
        text: "Text Here"
      }).addStyleClass("btnClass1");
    },
    createEditor: function createEditor() {
      return new MonacoEditor({});
    },
    getControllerName: function getControllerName() {
      return "sap.ui.core.mvc.Controller";
    }
  };
  AView = sap.ui.jsview("babel.test.test.fixtures.complex-jsx-import.actual", AView) || AView;
  _default = _extends(AView, _default);
  return _default;
})