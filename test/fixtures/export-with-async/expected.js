"use strict";

sap.ui.define("babel/test/test/fixtures/export-with-async/actual", [], function () {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

  var fetchCurrentUserInformation = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res, body;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch("/api/v1/user/");

            case 2:
              res = _context.sent;
              _context.next = 5;
              return res.json();

            case 5:
              body = _context.sent;
              return _context.abrupt("return", body);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function fetchCurrentUserInformation() {
      return _ref.apply(this, arguments);
    };
  }();

  _default = _extends({
    fetchCurrentUserInformation: fetchCurrentUserInformation
  }, _default);
  return _default;
})