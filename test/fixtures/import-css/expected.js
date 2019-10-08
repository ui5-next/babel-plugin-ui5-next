"use strict";

sap.ui.define("babel/test/test/fixtures/import-css/actual", ["babel/test/test/fixtures/import-css/AppRouter"], function (AppRouter) {
  var AppRouter = AppRouter.AppRouter;
  var _default = {};
  jQuery.sap.includeStyleSheet("index.css");
  jQuery.sap.includeStyleSheet("react/theme/index.css");
  AppRouter.placeAt("content");
  return _default;
})