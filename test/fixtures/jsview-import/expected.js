sap.ui.define("babel/test/test/fixtures/jsview-import/actual", ["sap/ui/core/mvc/JSView"], function (JSView) {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var AView = sap.ui.jsview("babel.test.test.fixtures.jsview-import.actual", {
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
  }) || {};
  _default = _extends(AView, _default);
  return _default;
})