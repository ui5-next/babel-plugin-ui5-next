# <img src="https://openui5.org/images/OpenUI5_new_big_side.png" height="25px" /> babel plugin ui5 next


[![npm](https://img.shields.io/npm/v/babel-plugin-ui5-next?label=babel-plugin-ui5-next)](https://www.npmjs.com/package/babel-plugin-ui5-next)
[![npm](https://img.shields.io/npm/v/babel-preset-ui5-next?label=babel-preset-ui5-next)](https://www.npmjs.com/package/babel-preset-ui5-next)


[![CircleCI](https://circleci.com/gh/ui5-next/babel-plugin-ui5-next.svg?style=shield)](https://circleci.com/gh/Soontao/babel-plugin-ui5-next)
![Github CI](https://github.com/ui5-next/babel-plugin-ui5-next/workflows/Github%20CI/badge.svg)
[![codecov](https://codecov.io/gh/ui5-next/babel-plugin-ui5-next/branch/master/graph/badge.svg)](https://codecov.io/gh/ui5-next/babel-plugin-ui5-next)
[![GitHub license](https://img.shields.io/github/license/Soontao/babel-plugin-ui5-next.svg)](https://github.com/Soontao/babel-plugin-ui5-next/blob/master/LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/ui5-next/babel-plugin-ui5-next/badge.svg)](https://snyk.io/test/github/ui5-next/babel-plugin-ui5-next)

Next-generation syntax for SAP UI5

## Features

- [Convert ES6 class](test/fixtures/es6-class-to-ui5-class) (inherited from UI5 classes) to UI5 class system
- [Convert ES6 module system](test/fixtures/es6-to-ui5-module) (`import/export`) to UI5 module system (`sap.ui.define`)
- Enhance `JSView` logic in import/export
- [JSX support](test/fixtures/jsx-support)
- Typescript support
- Class decorator support (beta, don't use this feature please)
- [Support import CSS in javascript](test/fixtures/import-css)
- Full test cases

## Limitation

- Limited by technical, this plugin will NOT compile (pure) ES6 classes to ES5 classes.
- Limited by technical, will not transform async function

## Usage

Please `DO NOT` use this plugin directly, just use [the generator](https://github.com/Soontao/ui5g) to generate UI5 project with predefined config.

## [CHANGELOG](./CHANGELOG.md)

## [LICENSE](./LICENSE)
