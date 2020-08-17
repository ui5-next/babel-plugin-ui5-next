"use strict";

sap.ui.define("babel/test/test/fixtures/es6-class-super/actual", [], function () {
  var _default = {};
  var A = sap.ui.base.Object.extend("babel.test.test.fixtures.es6-class-super.actual", {
    constructor: function constructor() {
      this.a = 1;
    }
  });
  var B = A.extend("babel.test.test.fixtures.es6-class-super.actual", {
    constructor: function constructor() {
      A.apply(this, []);
      this.a = 2;
    }
  });
  return _default;
})