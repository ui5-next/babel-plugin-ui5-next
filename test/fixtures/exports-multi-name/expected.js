"use strict";

sap.ui.define("babel/test/test/fixtures/exports-multi-name/actual", ["babel/test/test/fixtures/exports-multi-name/Router"], function (MobileRouter) {
  var _default = {};

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  class Route {
    constructor(name, path, control) {
      this.name = name;
      this.path = path;
      this.control = control;
    }

  }

  class RouterBuilder {
    construct(component, routes, mountId) {
      this.component = component;
      this.routes = routes;
      this.mountId = mountId;

      this._doCheck();
    }

    _doCheck() {}

    _buildRoutes() {
      this.routes.map(function (v) {
        return {
          pattern: v.path,
          name: v.name,
          target: v.target
        };
      });
    }

    _buildTargets() {
      return this.routes.reduce(function (pre, cur) {
        pre[cur.name] = cur;
        return pre;
      }, {});
    }

    build() {
      return new MobileRouter(this._buildRoutes(), {
        viewType: "JS",
        controlId: this.mountId,
        controlAggregation: "pages"
      }, this.component, this._buildTargets());
    }

  }

  RouterBuilder.newBuilder = function (component, routes, mountId) {
    return new RouterBuilder(component, routes, mountId);
  };

  _default = _extends({
    RouterBuilder: RouterBuilder,
    Route: Route
  }, _default);
  return _default;
})