"use strict";

sap.ui.define("babel/test/test/ts-fixtures/compile-ts-type/actual", [], function () {
  var _default = {};
  var Student = sap.ui.base.Object.extend("babel.test.test.ts-fixtures.compile-ts-type.actual", {
    constructor: function constructor(firstName, middleInitial, lastName) {
      this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
  });

  function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
  }

  var user = new Student("Jane", "M.", "User");
  var ZipCodeValidator = sap.ui.base.Object.extend("babel.test.test.ts-fixtures.compile-ts-type.actual", {
    isAcceptable: function isAcceptable(s) {
      return s.length === 5 && numberRegexp.test(s);
    }
  });
  _default = Object.assign({
    mainValidator: ZipCodeValidator
  }, _default);
  return _default;
})