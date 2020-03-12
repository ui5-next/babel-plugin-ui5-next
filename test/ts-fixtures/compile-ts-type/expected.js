"use strict";

sap.ui.define("babel/test/test/ts-fixtures/compile-ts-type/actual", [], function () {
  var _default = {};

  class Student {
    constructor(firstName, middleInitial, lastName) {
      this.firstName = firstName;
      this.middleInitial = middleInitial;
      this.lastName = lastName;
      this.fullName = firstName + " " + middleInitial + " " + lastName;
    }

  }

  function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
  }

  var user = new Student("Jane", "M.", "User");

  class ZipCodeValidator {
    isAcceptable(s) {
      return s.length === 5 && numberRegexp.test(s);
    }

  }

  _default = Object.assign({
    mainValidator: ZipCodeValidator
  }, _default);
  return _default;
})