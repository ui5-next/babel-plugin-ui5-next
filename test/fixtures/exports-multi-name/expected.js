sap.ui.define("babel/test/test/fixtures/exports-multi-name/actual", ["./Router"], function (MobileRouter) {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Route = function Route(name, path, control) {
    _classCallCheck(this, Route);

    this.name = name;
    this.path = path;
    this.control = control;
  };

  var RouterBuilder = function () {
    function RouterBuilder() {
      _classCallCheck(this, RouterBuilder);
    }

    _createClass(RouterBuilder, [{
      key: "construct",
      value: function construct(component, routes, mountId) {
        this.component = component;
        this.routes = routes;
        this.mountId = mountId;
        this._doCheck();
      }
    }, {
      key: "_doCheck",
      value: function _doCheck() {}
    }, {
      key: "_buildRoutes",
      value: function _buildRoutes() {
        this.routes.map(function (v) {
          return {
            pattern: v.path, name: v.name, target: v.target
          };
        });
      }
    }, {
      key: "_buildTargets",
      value: function _buildTargets() {

        return this.routes.reduce(function (pre, cur) {
          pre[cur.name] = cur;
          return pre;
        }, {});
      }
    }, {
      key: "build",
      value: function build() {

        return new MobileRouter(this._buildRoutes(), {
          viewType: "JS",
          controlId: this.mountId,
          controlAggregation: "pages"
        }, this.component, this._buildTargets());
      }
    }]);

    return RouterBuilder;
  }();

  RouterBuilder.newBuilder = function (component, routes, mountId) {
    return new RouterBuilder(component, routes, mountId);
  };

  _default = _extends({
    RouterBuilder: RouterBuilder,
    Route: Route
  }, _default);
  return _default;
})