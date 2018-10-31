const Path = require("path");
const { concat, split, slice, join, filter, find, flatten, map, isEmpty, trim, forEach, replace, reduce } = require("lodash");
const { readFileSync } = require("fs");

exports.default = (babel) => {
  const { types: t } = babel;
  /**
   * Get extension name from path
   *
   * Test.controller.js > .controller.js
   *
   * @param {string} path
   */
  const extensionName = (path) => {
    var r = join(slice(split(path, "."), 1), ".");
    if (r) {
      return `.${r}`;
    }
    return r;
  };

  const getFilePathWithCurrentFileAndRelativePath = (currentFileAbsPath = "", targetRelativePath = "") => {
    return Path.join(Path.dirname(currentFileAbsPath), targetRelativePath);
  };

  const getSourceCodeByPath = (path) => {
    return readFileSync(path, { encoding: "utf8" });
  };

  const isJSViewDefination = (str = "") => {
    return /class.*?extends.*?JSView/.test(str);
  };

  const removeViewOrController = (str = "") => {
    return replace(str, /\.(controller|view)$/g, "");
  };

  /**
   * Get the source code root path string
   *
   * @param {Object} path babel path object
   */
  const getSourceRoot = (path) => {
    let sourceRootPath = null;
    if (path.hub.file.opts.sourceRoot) {
      sourceRootPath = Path.resolve(path.hub.file.opts.sourceRoot);
    } else {
      sourceRootPath = Path.resolve("." + Path.sep);
    }
    return sourceRootPath;
  };


  /**
   * Get expression with style attached
   *
   * @param {string} classes ui5 class style string
   * @param {Object} expression input expression
   */
  const getAddStyleExpression = (classes = [], expression) => {
    if (isEmpty(classes)) {
      return expression;
    } else {
      var toBeAddedClass = classes.pop();
      return getAddStyleExpression(
        classes,
        t.callExpression(
          t.memberExpression(expression, t.identifier("addStyleClass")),
          [t.stringLiteral(toBeAddedClass)]
        )
      );
    }
  };


  const visitor = {

    Program: {

      /**
       * init with path related informations
       */
      enter: (path, state) => {
        var { namespace } = state.opts;
        const filePath = Path.resolve(path.hub.file.opts.filename);

        const sourceRootPath = getSourceRoot(path);

        let relativeFilePath = null;
        let relativeFilePathWithoutExtension = null;

        let namepath = namespace.replace(/\./g, "/");

        // format path
        if (filePath.startsWith(sourceRootPath)) {
          relativeFilePath = Path.relative(sourceRootPath, filePath);
          relativeFilePathWithoutExtension = Path.dirname(relativeFilePath) + Path.sep + Path.basename(relativeFilePath, extensionName(relativeFilePath));
          relativeFilePathWithoutExtension = relativeFilePathWithoutExtension.replace(/\\/g, "/");
        }

        if (!path.state) {
          path.state = {};
        }
        let modulepath = Path.join(namepath, relativeFilePathWithoutExtension).replace(/\\/g, "/");
        let moduleFullName = modulepath.replace(/\//g, ".");

        path.state.ui5 = {
          namespace,
          namepath,
          relativeFilePathWithoutExtension,
          modulepath,
          moduleFullName,
          imports: []
        };
      },

      /**
       * convert amd to ui5 module system
       */
      exit: path => {
        if (path.hub.file.code.startsWith("sap.ui.define")) {
          return;
        }
        const { imports, namepath, relativeFilePathWithoutExtension } = path.state.ui5;
        const fileAbsPath = t.stringLiteral(Path.join(namepath, relativeFilePathWithoutExtension).replace(/\\/g, "/"));

        // remove JSView import in import statment
        const importsIdentifier = filter(imports, { isView: false }).map(i => t.identifier(i.name));
        const importsSources = filter(imports, { isView: false }).map(i => t.stringLiteral(i.src));
        const _default = t.identifier("_default");

        const importExtractVars = flatten(
          map(
            filter(filter(imports, { isView: false }), i => i.specifiers.length > 0),
            i => i.specifiers.map(
              s => t.variableDeclaration(
                "var",
                [
                  t.variableDeclarator(
                    s.local,
                    t.memberExpression(t.identifier(i.name), s.imported)
                  )
                ]
              )
            )
          )
        );

        var body = path.node.body;

        // fix native ui5 module define
        if (body.length == 1 && body[0].type == "ExpressionStatement") {
          var callExpression = body[0].expression;
          if (callExpression.type == "CallExpression") {
            // body[0].expression = t.assignmentExpression(
            //   "=",
            //   _default,
            //   body[0].expression
            // );
            return;
          }

        } else {
          body = map(body, c => c.type == "CallExpression" ? t.expressionStatement(c) : c);
        }



        const defineCallArgs = [
          fileAbsPath,
          t.arrayExpression(importsSources),
          t.functionExpression(
            null, importsIdentifier, t.blockStatement(
              concat(
                importExtractVars,
                t.variableDeclaration(
                  "var",
                  [
                    t.variableDeclarator(
                      _default,
                      t.objectExpression([])
                    )
                  ]
                ),
                body, // original body
                t.returnStatement(_default)
              )
            )
          )
        ];

        const defineCall = t.callExpression(t.identifier("sap.ui.define"), defineCallArgs);

        path.node.body = [defineCall];

      }

    },

    /**
     * parse JSXText to parent JSX element text attr
     */
    JSXText: {
      enter: path => {
        const jsxElement = path.find(p => p.type == "JSXElement");
        const value = path.node.value;
        if (!trim(value) == "\n") {
          jsxElement.node.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier("text"), t.stringLiteral(value)));
        }
        path.remove();
      }
    },

    /**
     * parse JSX elements to UI5 construction
     */
    JSXElement: {

      exit: path => {

        var { imports } = path.state.ui5;


        // get jsx element type
        var tag = path.node.openingElement.name.name;

        var viewName = "";

        var viewImport = find(imports, { name: tag, isView: true });

        // if element is a View subclass
        if (viewImport) {
          tag = "JSView";
          // replace path to name
          viewName = removeViewOrController(viewImport.src.replace(/\//g, "."));
        }

        var classes = [];

        // map attrs to object property

        var props = reduce(path.node.openingElement.attributes, (pre, cur) => {
          if (p.name.name == "class") {

            classes = concat(classes, split(p.value.value, " "));

          } else {

            var id = t.identifier(p.name.name);

            switch (p.value.type) {
              case "JSXExpressionContainer":
                pre.push(t.objectProperty(id, p.value.expression))
              default:
                pre.push(t.objectProperty(id, p.value))
            }

          }
          return pre

        }, []);

        // > inner children
        const children = filter(path.node.children, c => {

          switch (c.type) {
            case "NewExpression": case "CallExpression":
              return true;
            default:
              return false;
          }

        });


        // with children elements
        if (children && children.length > 0) {
          props.push(t.objectProperty(t.identifier("content"), t.arrayExpression(children)));
        }

        // if this element is JSView element
        if (viewName) {

          props = [
            t.objectProperty(t.identifier("viewData"), t.objectExpression(props)),
            t.objectProperty(t.identifier("viewName"), t.stringLiteral(viewName))
          ];

        }

        // < inner children

        var expression = t.newExpression(
          t.identifier(tag),
          [
            t.objectExpression(props)
          ]
        );

        // with class define
        if (!isEmpty(classes)) {
          expression = getAddStyleExpression(classes, expression);
        }

        path.replaceWith(expression);

      }
    },

    /**
     * parse import statments & save it for module convertion
     */
    ImportDeclaration: {
      enter: path => {
        const currentFileAbsPath = path.hub.file.opts.filename;
        const state = path.state.ui5;

        const {
          /** current file path */
          relativeFilePathWithoutExtension,
          /**project name path */
          namepath
        } = state;

        const node = path.node;

        var name = "";

        var isViewImport = false;

        var src = node.source.value; // related path in import statment

        // is related source or third party lib
        if (src.startsWith("./") || src.startsWith("../") || !src.startsWith("sap")) {
          try {
            var sourcePath = getFilePathWithCurrentFileAndRelativePath(currentFileAbsPath, src);
            var importedSource = getSourceCodeByPath(`${sourcePath}.js`);

            if (isJSViewDefination(importedSource)) {
              isViewImport = true;
              // if not import sap.ui.core.mvc.JSView before
              if (isEmpty(find(state.imports, { name: "JSView" }))) {
                state.imports.push({
                  src: "sap/ui/core/mvc/JSView",
                  specifiers: [],
                  name: "JSView",
                  isView: false
                });
              }
            }

            src = Path.join(namepath, Path.dirname(relativeFilePathWithoutExtension), src).replace(/\\/g, "/");

          } catch (e) {
            // pass
          }
        }

        src = src.replace(/\\/g, "/");

        name = src.split("/").pop();

        var _defaultSpecifier = find(node.specifiers, { "type": "ImportDefaultSpecifier" });
        var _normalSpecifiers = filter(node.specifiers, { "type": "ImportSpecifier" });

        if (_defaultSpecifier) {
          name = _defaultSpecifier.local.name;
        }

        state.imports.push({
          src,
          specifiers: _normalSpecifiers || [],
          name,
          isView: isViewImport
        });

        path.remove();
      }
    },

    ExportDeclaration: {
      exit: path => {
        const _default = t.identifier("_default");
        var assign;
        switch (path.node.type) {
          case "ExportDefaultDeclaration":
            assign = t.assignmentExpression(
              "=",
              _default,
              t.callExpression(
                t.memberExpression(
                  t.identifier("Object"), t.identifier("assign")),
                [path.node.declaration, _default]
              )
            );
            break;
          case "ExportNamedDeclaration":
            assign = t.assignmentExpression(
              "=",
              t.memberExpression(
                _default,
                path.node.declaration.declarations[0].id
              ),
              path.node.declaration.declarations[0].init
            );
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
      exit: path => {

        const state = path.state.ui5;
        const node = path.node;
        const props = [];
        /**
         * current class extends super name
         */
        var superClassName = node.superClass.name;
        var fullClassName = "";
        var className = node.id.name;
        var expression = {};
        var haveDefinedGetControllerName = false;

        if (state.moduleFullName) {
          fullClassName = state.moduleFullName;
        } else {
          fullClassName = node.id.name;
        }

        forEach(node.body.body, member => {
          if (member.type === "ClassMethod") {
            const func = t.functionExpression(null, member.params, member.body);
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
              props.push(
                t.objectProperty(
                  t.identifier("getControllerName"),
                  t.functionExpression(
                    null,
                    [],
                    t.blockStatement([t.returnStatement(t.stringLiteral("sap.ui.core.mvc.Controller"))])
                  )
                )
              );

            }

            expression = t.logicalExpression(
              "||",
              t.callExpression(t.identifier("sap.ui.jsview"), [
                t.stringLiteral(fullClassName),
                t.objectExpression(props)
              ]),
              t.objectExpression([])
            );
            break;
          case "Fragment":
            expression = t.logicalExpression(
              "||",
              t.callExpression(t.identifier("sap.ui.jsfragment"), [
                t.stringLiteral(fullClassName),
                t.objectExpression(props)
              ]),
              t.objectExpression([])
            );

            break;
          default:
            expression = t.callExpression(t.identifier(superClassName + ".extend"), [
              t.stringLiteral(fullClassName),
              t.objectExpression(props)
            ]);
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
      enter: innerPath => {

        const node = innerPath.node;

        innerPath.findParent((p) => {
          if (p.isClassDeclaration()) {
            const superClassName = p.node.superClass.name;

            if (node.callee.type === "Super") {
              if (!superClassName) {
                this.errorWithNode("The keyword 'super' can only used in a derrived class.");
              }

              const identifier = t.identifier(superClassName + ".apply");
              let args = t.arrayExpression(node.arguments);
              if (node.arguments.length === 1 && node.arguments[0].type === "Identifier" && node.arguments[0].name === "arguments") {
                args = t.identifier("arguments");
              }
              innerPath.replaceWith(
                t.callExpression(identifier, [
                  t.identifier("this"),
                  args
                ])
              );
            } else if (node.callee.object && node.callee.object.type === "Super") {
              if (!superClassName) {
                this.errorWithNode("The keyword 'super' can only used in a derrived class.");
              }
              const identifier = t.identifier(superClassName + ".prototype" + "." + node.callee.property.name + ".apply");
              innerPath.replaceWith(
                t.callExpression(identifier, [
                  t.identifier("this"),
                  t.arrayExpression(node.arguments)
                ])
              );
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

module.exports = exports.default;