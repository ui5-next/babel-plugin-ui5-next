const Path = require("path");
const { concat, split, slice, join, filter, find, flatten, map, isEmpty, trim, forEach, replace, reduce } = require("lodash");
const { readFileSync, existsSync } = require("fs");
const { types: t } = require("@babel/core")

exports.default = babel => {

  /**
   * Get extension name from path
   *
   * Test.controller.js > .controller.js
   *
   * @param {string} path
   */
  const extensionName = path => {
    var r = join(slice(split(path, "."), 1), ".");
    if (r) {
      return `.${r}`;
    }
    return r;
  };

  const pathJoin = (currentFileAbsPath = "", targetRelativePath = "") => {
    return Path.join(Path.dirname(currentFileAbsPath), targetRelativePath);
  };

  /**
   * read source from different type source
   * 
   * @param {string} path 
   */
  const readSource = path => {
    const ext = find([".js", ".jsx", ".mjs", ".ts", ".tsx"], ext => existsSync(`${path}${ext}`))
    if (ext) {
      return readFileSync(`${path}${ext}`, { encoding: "utf8" })
    } else {
      return ""
    }

  }

  const isJSViewDefinition = (str = "") => {
    return /class.*?extends.*?JSView/.test(str);
  };

  const isUI5Control = (str = "") => {
    var importedUI5Control = /sap\/ui\/core\/Control/.test(str) || /sap\.ui\.core\.Control/.test(str)
    var extendControl = /class.*?extends.*?Control/.test(str) || /sap\.ui\.core\.Control\.extend/.test(str)
    return importedUI5Control && extendControl
  }

  const isReactComponent = (str = "") => {
    var importedReact = /import.*?Component.*?from.*?react/.test(str)
    var extendComponent = /class.*?extends.*?Component/.test(str)
    return importedReact && extendComponent
  }

  const removeViewOrController = (str = "") => {
    return replace(str, /\.(controller|view)$/g, "");
  };

  const mapDecoratorsToExpression = (decorators, inner) => {
    if (isEmpty(decorators)) {
      return inner;
    } else {
      var wrapper = inner;
      decorators.forEach(decorator => {
        wrapper = t.callExpression(decorator.expression, [wrapper]);
      });
      return wrapper;
    }
  };

  /**
   * check class is UI5 Class from imports list
   * 
   * @param {string} className 
   * @param {Array} imports 
   */
  const isUI5Class = (className = "", imports = [], srcPath) => {

    var rt = false

    if (isEmpty(className)) {
      return rt
    }

    // find super class
    imports.forEach(i => {

      if (i.name == className) {

        if (i.src.startsWith("sap")) {
          rt = true
        } else if (srcPath && i.originalSrc) {

          if (i.originalSrc.startsWith("./") || i.originalSrc.startsWith("../")) {

            try {

              const classSource = readSource(pathJoin(srcPath, `${i.originalSrc}`))

              if (isJSViewDefinition(classSource)) {
                rt = true
                return
              }

              if (isUI5Control(classSource)) {
                rt = true
                return
              }

              if (isReactComponent(classSource)) {
                rt = false
              } else {
                rt = true
              }

            } catch (error) {
              console.error(error)
              // module not found
            }

          } else {

            rt = false

          }

        } else {

          rt = false

        }

      }
    })

    return rt

  }

  const classInnerCallSuperVisitor = superClassName => ({
    /**
     * convert super call in class
     */
    CallExpression: {
      enter: innerPath => {
        const node = innerPath.node;
        if (node.callee.type === "Super") {
          if (!superClassName) {
            this.errorWithNode(
              "The keyword 'super' can only used in a derrived class."
            );
          }

          const identifier = t.identifier(superClassName + ".apply");
          let args = t.arrayExpression(node.arguments);
          if (
            node.arguments.length === 1 &&
            node.arguments[0].type === "Identifier" &&
            node.arguments[0].name === "arguments"
          ) {
            args = t.identifier("arguments");
          }
          innerPath.replaceWith(
            t.callExpression(identifier, [t.identifier("this"), args])
          );
        } else if (node.callee.object && node.callee.object.type === "Super") {
          if (!superClassName) {
            this.errorWithNode(
              "The keyword 'super' can only used in a derrived class."
            );
          }
          const identifier = t.identifier(
            superClassName +
            ".prototype" +
            "." +
            node.callee.property.name +
            ".apply"
          );
          innerPath.replaceWith(
            t.callExpression(identifier, [
              t.identifier("this"),
              t.arrayExpression(node.arguments)
            ])
          );
        }
      }
    }
  });

  /**
   * Get the source code root path string
   *
   * @param {Object} path babel path object
   */
  const getSourceRoot = path => {
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

        if (isEmpty(namespace)) {
          throw new Error("You must set namesapce for babel-blugin-ui5-next !");
        }

        const filePath = Path.resolve(path.hub.file.opts.filename);

        const sourceRootPath = getSourceRoot(path);

        let relativeFilePath = null;
        let relativeFilePathWithoutExtension = null;

        let namepath = namespace.replace(/\./g, "/");

        // format path
        if (filePath.startsWith(sourceRootPath)) {
          relativeFilePath = Path.relative(sourceRootPath, filePath);
          relativeFilePathWithoutExtension =
            Path.dirname(relativeFilePath) +
            Path.sep +
            Path.basename(relativeFilePath, extensionName(relativeFilePath));
          relativeFilePathWithoutExtension = relativeFilePathWithoutExtension.replace(
            /\\/g,
            "/"
          );
        }

        if (!path.state) {
          path.state = {};
        }
        let modulepath = Path.join(
          namepath,
          relativeFilePathWithoutExtension
        ).replace(/\\/g, "/");
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
        // if start with 'sap', means use native UI5 module, just skip
        if (path.hub.file.code.trim().startsWith("sap")) {
          return;
        }
        const { imports, namepath, relativeFilePathWithoutExtension } = path.state.ui5;

        const fileAbsPath = t.stringLiteral(
          Path.join(namepath, relativeFilePathWithoutExtension).replace(
            /\\/g,
            "/"
          )
        );

        // remove JSView import in import statement
        // sap.ui.define([], {a,b,c,d}) ... 
        const importsIdentifier = filter(imports, { isView: false }).map(i => t.identifier(i.name));

        // sap.ui.define({["sap/ui...", ...]}...) ... 
        const importsSources = filter(imports, { isView: false }).map(i => t.stringLiteral(i.src));

        const _default = t.identifier("_default");

        const importExtractVars = flatten(
          map(
            filter(
              filter(imports, { isView: false }),
              i => i.specifiers.length > 0
            ),
            i =>
              i.specifiers.map(s =>
                t.variableDeclaration("var", [
                  t.variableDeclarator(
                    s.local,
                    t.memberExpression(t.identifier(i.name), s.imported)
                  )
                ])
              )
          )
        );

        var body = path.node.body.map(c => c.type == "CallExpression" ? t.expressionStatement(c) : c);

        const defineCallArgs = [
          fileAbsPath,
          t.arrayExpression(importsSources),
          t.functionExpression(
            null,
            importsIdentifier,
            t.blockStatement(
              concat(
                importExtractVars,
                t.variableDeclaration("var", [
                  t.variableDeclarator(_default, t.objectExpression([]))
                ]),
                body, // original body
                t.returnStatement(_default)
              )
            )
          )
        ];

        const defineCall = t.callExpression(
          t.identifier("sap.ui.define"),
          defineCallArgs
        );

        path.node.body = [defineCall];
      }
    },

    /**
     * parse JSXText to parent JSX element text attr
     */
    JSXText: {
      enter: path => {
        const srcPath = path.hub.file.opts.filename;
        const { imports } = path.state.ui5;

        const jsxElement = path.find(p => p.type == "JSXElement");

        const tag = jsxElement.node.openingElement.name.name;

        // not process if not UI5 module
        if (!isUI5Class(tag, imports, srcPath)) {
          return
        }

        const value = path.node.value;
        if (!trim(value) == "\n") {
          jsxElement.node.openingElement.attributes.push(
            t.jSXAttribute(t.jSXIdentifier("text"), t.stringLiteral(value))
          );
        }

        path.remove();

      }
    },

    /**
     * parse JSX elements to UI5 construction
     */
    JSXElement: {
      exit: path => {
        const srcPath = path.hub.file.opts.filename;
        var { imports } = path.state.ui5;

        // get jsx element type
        var tag = path.node.openingElement.name.name;

        if (!isUI5Class(tag, imports, srcPath)) {
          return
        }

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

        var props = reduce(
          path.node.openingElement.attributes,
          (pre, p) => {
            if (p.name.name == "class") {
              classes = concat(classes, split(p.value.value, " "));
            } else {
              var id = t.identifier(p.name.name);

              switch (p.value.type) {
                case "JSXExpressionContainer":
                  pre.push(t.objectProperty(id, p.value.expression));
                  break;
                default:
                  pre.push(t.objectProperty(id, p.value));
                  break;
              }
            }
            return pre;
          },
          []
        );

        // > inner children
        const children = []

        path.node.children && path.node.children.forEach(c => {
          switch (c.type) {
            case "NewExpression":
            case "CallExpression":
              children.push(c)
              break
            case "JSXExpressionContainer":
              // jsx empty expression will trigger babel errors
              if (c.expression.type != "JSXEmptyExpression") {
                children.push(c.expression)
              }
              break
          }
        })



        // with children elements
        if (children && children.length > 0) {
          props.push(
            t.objectProperty(
              t.identifier("content"),
              t.arrayExpression(children)
            )
          );
        }

        // if this element is JSView element
        if (viewName) {
          props = [
            t.objectProperty(
              t.identifier("viewData"),
              t.objectExpression(props)
            ),
            t.objectProperty(
              t.identifier("viewName"),
              t.stringLiteral(viewName)
            )
          ];
        }

        // < inner children

        var expression = t.newExpression(t.identifier(tag), [
          t.objectExpression(props)
        ]);

        // with class define
        if (!isEmpty(classes)) {
          expression = getAddStyleExpression(classes, expression);
        }

        path.replaceWith(expression);
      }
    },

    /**
     * parse import statements & save it for module transform
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

        var src = node.source.value || ""; // related path in import statement
        var mOriginalSrc = node.source.value; // related path in import statement

        var isImportCss = src.endsWith(".css")

        var isRelativeModule = src.startsWith("./") || src.startsWith("../");

        var isNonUi5Module = !src.startsWith("sap")

        // if import css, replace import as css load expression
        if (isImportCss) {

          // >>> from
          // import "base.css"
          // >>> to
          // jQuery.sap.includeStyleSheet("base.css");

          path.replaceWith(
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(
                  t.memberExpression(
                    t.identifier("jQuery"),
                    t.identifier("sap")
                  ),
                  t.identifier("includeStyleSheet")
                ),
                [t.stringLiteral(src)]
              )
            )
          );

          return;
        } else if (isRelativeModule && isNonUi5Module) {
          // is related source or third party lib
          try {
            var sourcePath = pathJoin(currentFileAbsPath, src);
            var importedSource = readSource(`${sourcePath}`);

            if (isJSViewDefinition(importedSource)) {
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

        // default name same with last part of library
        name = src.split("/").pop().replace(/\W/g, '');;

        var _defaultSpecifier = find(node.specifiers, {
          type: "ImportDefaultSpecifier"
        });

        var _normalSpecifiers = filter(node.specifiers, {
          type: "ImportSpecifier"
        });

        if (_defaultSpecifier) {
          name = _defaultSpecifier.local.name;
        }

        state.imports.push({
          src,
          originalSrc: mOriginalSrc,
          specifiers: _normalSpecifiers || [],
          name,
          isView: isViewImport
        });

        path.remove();
      }
    },

    ExportDeclaration: {

      enter: path => {
        const _default = t.identifier("_default");
        var assign;

        switch (path.node.type) {
          case "ExportDefaultDeclaration":
            if (path.node.declaration) {
              switch (path.node.declaration.type) {

                case "ClassDeclaration":
                  path.insertBefore(path.node.declaration)
                  assign = t.assignmentExpression(
                    "=",
                    _default,
                    t.callExpression(
                      t.memberExpression(
                        t.identifier("Object"),
                        t.identifier("assign")
                      ),
                      [path.node.declaration.id, _default]
                    )
                  );
                  break;

                default:
                  assign = t.assignmentExpression(
                    "=",
                    _default,
                    t.callExpression(
                      t.memberExpression(
                        t.identifier("Object"),
                        t.identifier("assign")
                      ),
                      [path.node.declaration, _default]
                    )
                  );
                  break;
              }

            } else {

              assign = t.assignmentExpression(
                "=",
                _default,
                t.callExpression(
                  t.memberExpression(
                    t.identifier("Object"),
                    t.identifier("assign")
                  ),
                  [path.node.declaration, _default]
                )
              );

            }

            break;
          case "ExportNamedDeclaration":
            if (path && path.node && path.node.declaration) {
              switch (path.node.declaration.type) {
                case "ClassDeclaration":
                  var exportId = path.node.declaration.id
                  var exportBody = path.node.declaration.body

                  path.insertBefore(path.node.declaration)

                  assign = t.assignmentExpression(
                    "=",
                    t.memberExpression(_default, exportId),
                    exportId
                  );

                  break;

                case "VariableDeclaration":

                  path.insertBefore(path.node.declaration)

                  forEach(path.node.declaration.declarations, d => {
                    if (d.id) {
                      path.insertBefore(t.expressionStatement(t.assignmentExpression(
                        "=",
                        t.memberExpression(_default, d.id),
                        d.id
                      )))
                    }
                  })

                  break

                case "TSEnumDeclaration":

                  path.insertBefore(path.node.declaration)
                  var { id } = path.node.declaration
                  if (id) {
                    path.insertBefore(t.expressionStatement(t.assignmentExpression(
                      "=",
                      t.memberExpression(_default, id),
                      id
                    )))
                  }
                  break

                default:
                  break;
              }
            }



            if (path && path.node && !isEmpty(path.node.specifiers)) {
              assign = t.assignmentExpression(
                "=",
                _default,
                t.callExpression(
                  t.memberExpression(
                    t.identifier("Object"),
                    t.identifier("assign")
                  ),
                  [
                    t.objectExpression(
                      map(path.node.specifiers, spec => t.objectProperty(spec.exported, spec.local))
                    ),
                    _default
                  ]
                )
              );
            }

            break;
          default:
            break;
        }

        if (assign) {
          path.insertAfter(t.expressionStatement(assign));
        }

        path.remove()

      }
    },

    /**
     * convert ES6 class definition to UI5 class defination
     *
     * class A extend B {} > B.extend("A", {})
     */
    ClassDeclaration: {
      enter: path => {
        const state = path.state.ui5;
        const node = path.node;
        const props = [];

        // if not extends with class
        if (isEmpty(node.superClass)) {
          return;
        }

        // if not extends from UI5 class
        if (!isUI5Class(node.superClass.name, state.imports)) {
          return;
        }

        /**
         * current class extends super name
         */
        var superClassName = node.superClass.name;

        // super.init() => SuperClassName.prototype.init.apply(this,[]) ...
        path.traverse(classInnerCallSuperVisitor(superClassName));

        var fullClassName = "";
        var className = node.id.name;
        var expression = {};
        var haveDefinedGetControllerName = false;

        if (state.moduleFullName) {
          fullClassName = state.moduleFullName;
        } else {
          fullClassName = node.id.name;
        }

        var decorators = node.decorators;

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
            if (member.key && member.value) {
              props.push(t.objectProperty(member.key, member.value));
            }
            // removed warning, class property will be processed by typescript transform
            // 
            // else {
            //   console.warn(`Not support class member ${member.key} in ${className} `)
            // }
          }
        });

        switch (superClassName) {
          case "JSView":
            // set a default getControllerName
            if (!haveDefinedGetControllerName) {
              props.push(
                t.objectProperty(
                  t.identifier("getControllerName"),
                  t.functionExpression(
                    null,
                    [],
                    t.blockStatement([
                      t.returnStatement(
                        t.stringLiteral("sap.ui.core.mvc.Controller")
                      )
                    ])
                  )
                )
              );
            }

            path.insertBefore(
              t.variableDeclaration("var", [
                t.variableDeclarator(
                  t.identifier(className),
                  mapDecoratorsToExpression(
                    decorators,
                    t.objectExpression(props)
                  )
                )
              ])
            );

            path.insertBefore(
              t.expressionStatement(
                t.assignmentExpression(
                  "=",
                  t.identifier(className),
                  t.logicalExpression(
                    "||",
                    t.callExpression(t.identifier("sap.ui.jsview"), [
                      t.stringLiteral(fullClassName),
                      t.identifier(className)
                    ]),
                    t.identifier(className)
                  )
                )
              )
            );

            path.remove()

            break;
          case "Fragment":

            path.insertBefore(
              t.variableDeclaration("var", [
                t.variableDeclarator(
                  t.identifier(className),
                  mapDecoratorsToExpression(
                    decorators,
                    t.objectExpression(props)
                  )
                )
              ])
            );

            path.insertBefore(
              t.expressionStatement(
                t.assignmentExpression(
                  "=",
                  t.identifier(className),
                  t.logicalExpression(
                    "||",
                    t.callExpression(t.identifier("sap.ui.jsfragment"), [
                      t.stringLiteral(fullClassName),
                      t.identifier(className)
                    ]),
                    t.identifier(className)
                  )
                )
              )
            );

            path.remove()

            break;
          default:

            expression = t.callExpression(
              t.identifier(superClassName + ".extend"),
              [t.stringLiteral(fullClassName), t.objectExpression(props)]
            );

            path.insertBefore(
              t.variableDeclaration("var", [
                t.variableDeclarator(t.identifier(className), expression)
              ])
            );

            path.remove()

            break;
        }
      }
    }
  };

  return {
    visitor: visitor
  };
};

module.exports = exports.default;
