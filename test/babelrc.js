const path = require("path")

module.exports = {
  "plugins": [
    [
      path.join(__dirname, "../lib/index"),
      {
        "namespace": "babel.test"
      }
    ],
    [
      "@babel/plugin-transform-typescript", { isTSX: true }
    ],
    "@babel/plugin-syntax-jsx",
    "@babel/plugin-syntax-class-properties",
    "babel-plugin-transform-async-to-promises",
    "@babel/plugin-transform-template-literals",
    "@babel/plugin-transform-literals",
    "@babel/plugin-transform-function-name",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-block-scoped-functions",
    "@babel/plugin-transform-shorthand-properties",
    "@babel/plugin-transform-computed-properties",
    "@babel/plugin-transform-duplicate-keys",
    "@babel/plugin-transform-for-of",
    "@babel/plugin-transform-sticky-regex",
    "@babel/plugin-transform-unicode-regex",
    "@babel/plugin-check-constants",
    "@babel/plugin-transform-spread",
    "@babel/plugin-transform-parameters",
    "@babel/plugin-transform-destructuring",
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-typeof-symbol",
    "@babel/plugin-transform-regenerator",
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-proposal-object-rest-spread",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-transform-react-jsx"
  ]
}