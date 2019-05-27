sap.ui.define("babel/test/test/fixtures/direct-import/actual", ["babel-cli", "./AppRouter", "babel-plugin-syntax-decorators"], function (babelcli, AppRouter, babelpluginsyntaxdecorators) {
  var AppRouter = AppRouter.AppRouter;
  var name = babelpluginsyntaxdecorators.name;
  var _default = {};


  AppRouter.placeAt("content");
  return _default;
})