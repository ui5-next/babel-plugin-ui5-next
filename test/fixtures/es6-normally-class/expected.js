sap.ui.define("babel/test/test/fixtures/es6-normally-class/actual", [], function () {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  _default.C = function C() {
    _classCallCheck(this, C);
  };

  var AView = function AView() {
    _classCallCheck(this, AView);

    this.state = {};

    this.v = function () {};
  };

  _default = _extends(AView, _default);
  return _default;
})