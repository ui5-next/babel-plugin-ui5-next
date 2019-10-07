"use strict";

sap.ui.define("babel/test/test/ts-fixtures/compile-ts-enum/actual", [], function () {
  var _default = {};
  var Direction;

  (function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
  })(Direction || (Direction = {}));

  _default.Direction = Direction;
  return _default;
})