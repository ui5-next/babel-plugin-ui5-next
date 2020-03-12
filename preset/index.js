module.exports = function preset(context, options = {}) {

  const { namespace } = options;

  if (!namespace) {
    throw new Error("You must set config 'namespace' for babel-preset-ui5-next !")
  }

  return {
    plugins: [
      [
        "babel-plugin-ui5-next", { namespace }
      ],
      [
        "@babel/plugin-transform-typescript", { isTSX: true }
      ],
      "@babel/plugin-syntax-jsx",
      "@babel/plugin-syntax-class-properties",
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
      "@babel/plugin-transform-spread",
      "@babel/plugin-transform-parameters",
      "@babel/plugin-transform-destructuring",
      "@babel/plugin-transform-block-scoping",
      "@babel/plugin-transform-typeof-symbol",
      "@babel/plugin-proposal-object-rest-spread",
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ],
      "@babel/plugin-transform-react-jsx",
    ]
  };

};