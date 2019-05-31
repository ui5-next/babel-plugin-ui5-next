sap.ui.define("babel/test/test/fixtures/export-with-async/actual", [], function () {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _this = this;

  var fetchCurrentUserInformation = function fetchCurrentUserInformation() {
    var res, body;
    return regeneratorRuntime.async(function fetchCurrentUserInformation$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(fetch("/api/v1/user/"));

          case 2:
            res = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap(res.json());

          case 5:
            body = _context.sent;
            return _context.abrupt("return", body);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, null, _this);
  };

  _default = _extends({
    fetchCurrentUserInformation: fetchCurrentUserInformation
  }, _default);
  return _default;
})