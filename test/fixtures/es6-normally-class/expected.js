sap.ui.define("babel/test/test/fixtures/es6-normally-class/actual", [], function () {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  _default.C = function C() {
    _classCallCheck(this, C);
  };

  var AView = function () {
    function AView() {
      _classCallCheck(this, AView);
    }

    _createClass(AView, [{
      key: "v",
      value: function v() {}
    }]);

    return AView;
  }();

  _default = _extends(AView, _default);
  return _default;
})