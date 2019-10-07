"use strict";

sap.ui.define("babel/test/test/ts-fixtures/compile-ts-type/actual", [], function () {
  var _default = {};

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  _default = _extends({
    mainValidator: ZipCodeValidator
  }, _default);
  return _default;
})