"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var _this = this;

  var t = _ref.types;


  /**
   * Get extension name from path
   * 
   * Test.controller.js > .controller.js
   * 
   * @param {string} path 
   */
  var extensionName = function extensionName(path) {
    var r = (0, _lodash.join)((0, _lodash.slice)((0, _lodash.split)(path, "."), 1), ".");
    if (r) {
      return "." + r;
    }
    return r;
  };

  /**
   * Get the source code root path string
   * 
   * @param {Object} path babel path object
   */
  var getSourceRoot = function getSourceRoot(path) {
    var sourceRootPath = null;
    if (path.hub.file.opts.sourceRoot) {
      sourceRootPath = _path2.default.resolve(path.hub.file.opts.sourceRoot);
    } else {
      sourceRootPath = _path2.default.resolve("." + _path2.default.sep);
    }
    return sourceRootPath;
  };

  /**
   * Get expression with style attached
   * 
   * @param {string} classes ui5 class style string
   * @param {Object} expression input expression
   */
  var getAddStyleExpression = function getAddStyleExpression() {
    var classes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var expression = arguments[1];

    if ((0, _lodash.isEmpty)(classes)) {
      return expression;
    } else {
      var toBeAddedClass = classes.pop();
      return getAddStyleExpression(classes, t.callExpression(t.memberExpression(expression, t.identifier("addStyleClass")), [t.stringLiteral(toBeAddedClass)]));
    }
  };

  var visitor = {

    Program: {
      /**
       * init with path related informations
       */
      enter: function enter(path, state) {
        var namespace = state.opts.namespace;

        var filePath = _path2.default.resolve(path.hub.file.opts.filename);

        var sourceRootPath = getSourceRoot(path);

        var relativeFilePath = null;
        var relativeFilePathWithoutExtension = null;

        var namepath = namespace.replace(/\./g, "/");

        // format path
        if (filePath.startsWith(sourceRootPath)) {
          relativeFilePath = _path2.default.relative(sourceRootPath, filePath);
          relativeFilePathWithoutExtension = _path2.default.dirname(relativeFilePath) + _path2.default.sep + _path2.default.basename(relativeFilePath, extensionName(relativeFilePath));
          relativeFilePathWithoutExtension = relativeFilePathWithoutExtension.replace(/\\/g, "/");
          namepath = _path2.default.join(namepath, relativeFilePathWithoutExtension).replace(/\\/g, "/");
          // not root file
          namespace = namepath.replace(/\//g, ".");
        }

        namepath = namepath.replace(/\\/g, "/");

        if (!path.state) {
          path.state = {};
        }

        path.state.ui5 = {
          namespace: namespace,
          namepath: namepath,
          imports: []
        };
      },
      /**
       * convert amd to ui5 module system
       */
      exit: function exit(path) {
        var _path$state$ui = path.state.ui5,
            imports = _path$state$ui.imports,
            namepath = _path$state$ui.namepath;

        var fileAbsPath = t.stringLiteral(namepath);

        var importsIdentifier = imports.map(function (i) {
          return t.identifier(i.name);
        });
        var importsSources = imports.map(function (i) {
          return t.stringLiteral(i.src);
        });
        var _default = t.identifier("_default");

        var importExtractVars = (0, _lodash.flatten)((0, _lodash.map)((0, _lodash.filter)(imports, function (i) {
          return i.specifiers.length > 0;
        }), function (i) {
          return i.specifiers.map(function (s) {
            return t.variableDeclaration("var", [t.variableDeclarator(s.local, t.memberExpression(t.identifier(i.name), s.imported))]);
          });
        }));

        var defineCallArgs = [fileAbsPath, t.arrayExpression(importsSources), t.functionExpression(null, importsIdentifier, t.blockStatement((0, _lodash.concat)(importExtractVars, t.variableDeclaration("var", [t.variableDeclarator(_default, t.objectExpression([]))]), path.node.body, // original body
        t.returnStatement(_default))))];

        var defineCall = t.callExpression(t.identifier("sap.ui.define"), defineCallArgs);

        path.node.body = [defineCall];
      }

    },

    /**
     * parse JSXText to parent JSX element text attr
     */
    JSXText: {
      enter: function enter(path) {
        var jsxElement = path.find(function (p) {
          return p.type == "JSXElement";
        });
        var value = path.node.value;
        if (!(0, _lodash.trim)(value) == "\n") {
          jsxElement.node.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier("text"), t.stringLiteral(value)));
        }
        path.remove();
      }
    },

    /**
     * parse JSX elements to UI5 construction
     */
    JSXElement: {
      exit: function exit(path) {
        // get jsx element type
        var tag = path.node.openingElement.name.name;
        var classes = [];
        // map attrs to object property
        var props = path.node.openingElement.attributes.map(function (p) {
          if (p.name.name == "class") {
            classes = (0, _lodash.concat)(classes, (0, _lodash.split)(p.value.value, " "));
          }
          var id = t.identifier(p.name.name);
          switch (p.value.type) {
            case "JSXExpressionContainer":
              return t.objectProperty(id, p.value.expression);
            default:
              return t.objectProperty(id, p.value);
          }
        }) || [];

        // > inner children
        var children = (0, _lodash.filter)(path.node.children, function (c) {

          switch (c.type) {
            case "NewExpression":case "CallExpression":
              return true;
            default:
              return false;
          }
        });

        if (children && children.length > 0) {
          props.push(t.objectProperty(t.identifier("content"), t.arrayExpression(children)));
        }

        // < inner children

        var expression = t.newExpression(t.identifier(tag), [t.objectExpression(props)]);

        // with class define
        if (!(0, _lodash.isEmpty)(classes)) {
          expression = getAddStyleExpression(classes, expression);
        }

        path.replaceWith(expression);
      }
    },

    /**
     * parse import statments & save it for module convertion
     */
    ImportDeclaration: {
      enter: function enter(path) {
        var state = path.state.ui5;
        var namepath = state.namepath;

        var node = path.node;

        var name = "";

        var src = node.source.value;
        if (src.startsWith("./") || src.startsWith("../") || !src.startsWith("sap")) {
          try {
            var sourceRootPath = getSourceRoot(path);
            src = _path2.default.join(namepath, _path2.default.relative(sourceRootPath, _path2.default.resolve(_path2.default.dirname(path.hub.file.opts.filename), src))).replace(/\\/g, "");
          } catch (e) {
            // pass
          }
        }

        src = src.replace(/\\/g, "/");

        name = src.split("/").pop();

        var _defaultSpecifier = (0, _lodash.find)(node.specifiers, { "type": "ImportDefaultSpecifier" });
        var _normalSpecifiers = (0, _lodash.filter)(node.specifiers, { "type": "ImportSpecifier" });

        if (_defaultSpecifier) {
          name = _defaultSpecifier.local.name;
        }

        var imp = {
          src: src.replace(/\\/g, "/"),
          specifiers: _normalSpecifiers || [],
          name: name
        };
        state.imports.push(imp);

        path.remove();
      }
    },

    ExportDeclaration: {
      exit: function exit(path) {
        var _default = t.identifier("_default");
        var assign;
        switch (path.node.type) {
          case "ExportDefaultDeclaration":
            assign = t.assignmentExpression("=", _default, t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("assign")), [path.node.declaration, _default]));
            break;
          case "ExportNamedDeclaration":
            assign = t.assignmentExpression("=", t.memberExpression(_default, path.node.declaration.declarations[0].id), path.node.declaration.declarations[0].init);
            break;
          default:
            break;
        }
        if (assign) {
          path.replaceWith(assign);
        }
      }
    },

    /**
     * convert ES6 class defination to UI5 class defination
     * 
     * class A extens B {} > B.extend("A", {})
     */
    ClassDeclaration: {
      exit: function exit(path) {

        var state = path.state.ui5;
        var node = path.node;
        var props = [];
        /**
         * current class extends super name
         */
        var superClassName = node.superClass.name;
        var fullClassName = "";
        var className = node.id.name;
        var expression = {};
        var haveDefinedGetControllerName = false;

        if (state.namespace) {
          fullClassName = state.namespace;
        } else {
          fullClassName = node.id.name;
        }

        (0, _lodash.forEach)(node.body.body, function (member) {
          if (member.type === "ClassMethod") {
            var func = t.functionExpression(null, member.params, member.body);
            func.generator = member.generator;
            func.async = member.async;
            props.push(t.objectProperty(member.key, func));
            if (member.key.name == "getControllerName") {
              haveDefinedGetControllerName = true;
            }
          } else if (member.type == "ClassProperty") {
            props.push(t.objectProperty(member.key, member.value));
          }
        });

        switch (superClassName) {
          case "JSView":
            if (!haveDefinedGetControllerName) {
              props.push(t.objectProperty(t.identifier("getControllerName"), t.functionExpression(null, [], t.blockStatement([t.returnStatement(t.stringLiteral(fullClassName))]))));
            }
            expression = t.logicalExpression("||", t.callExpression(t.identifier("sap.ui.jsview"), [t.stringLiteral(fullClassName), t.objectExpression(props)]), t.objectExpression([]));
            break;
          case "Fragment":
            expression = t.logicalExpression("||", t.callExpression(t.identifier("sap.ui.jsfragment"), [t.stringLiteral(fullClassName), t.objectExpression(props)]), t.objectExpression([]));

            break;
          default:
            expression = t.callExpression(t.identifier(superClassName + ".extend"), [t.stringLiteral(fullClassName), t.objectExpression(props)]);
            break;
        }

        if (path.parent && path.parent.type == "ExportNamedDeclaration") {
          path.replaceWith(t.variableDeclaration("var", [t.variableDeclarator(t.identifier(className), expression)]));
        } else {
          path.replaceWith(expression);
        }
      }
    },

    /**
     * convert super call in class
     */
    CallExpression: {
      enter: function enter(innerPath) {

        var node = innerPath.node;

        innerPath.findParent(function (p) {
          if (p.isClassDeclaration()) {
            var superClassName = p.node.superClass.name;

            if (node.callee.type === "Super") {
              if (!superClassName) {
                _this.errorWithNode("The keyword 'super' can only used in a derrived class.");
              }

              var identifier = t.identifier(superClassName + ".apply");
              var args = t.arrayExpression(node.arguments);
              if (node.arguments.length === 1 && node.arguments[0].type === "Identifier" && node.arguments[0].name === "arguments") {
                args = t.identifier("arguments");
              }
              innerPath.replaceWith(t.callExpression(identifier, [t.identifier("this"), args]));
            } else if (node.callee.object && node.callee.object.type === "Super") {
              if (!superClassName) {
                _this.errorWithNode("The keyword 'super' can only used in a derrived class.");
              }
              var _identifier = t.identifier(superClassName + ".prototype" + "." + node.callee.property.name + ".apply");
              innerPath.replaceWith(t.callExpression(_identifier, [t.identifier("this"), t.arrayExpression(node.arguments)]));
            }
          }
        });
      }

    }
  };

  return {
    visitor: visitor
  };
};

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;