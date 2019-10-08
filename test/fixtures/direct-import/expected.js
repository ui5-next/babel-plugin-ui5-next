"use strict";

sap.ui.define("babel/test/test/fixtures/direct-import/actual", ["babel-cli", "babel/test/test/fixtures/direct-import/AppRouter", "@babel/plugin-syntax-decorators"], function (babelcli, AppRouter, pluginsyntaxdecorators) {
  var AppRouter = AppRouter.AppRouter;
  var name = pluginsyntaxdecorators.name;
  var _default = {};
  console.log(name);
  AppRouter.placeAt("content");
  return _default;
})