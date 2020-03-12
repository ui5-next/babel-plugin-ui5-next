"use strict";

sap.ui.define("babel/test/test/fixtures/compile-ui5-component/actual", ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "sap/ui/Device", "babel/test/test/fixtures/compile-ui5-component/fragments/HelloDialog", "babel/test/test/fixtures/compile-ui5-component/manifest"], function (UIComponent, JSONModel, Device, HelloDialog, manifest) {
  var createHelloDialog = HelloDialog.createHelloDialog;
  var manifest = manifest.manifest;
  var _default = {};
  var Component = UIComponent.extend("babel.test.test.fixtures.compile-ui5-component.actual", {
    metadata: {
      manifest: manifest
    },
    init: function init() {
      UIComponent.prototype.init.apply(this, [this, arguments]); // set data model

      var oData = {
        recipient: {
          name: "World"
        }
      };
      var oModel = new JSONModel(oData);
      this.setModel(oModel); // set device model

      var oDeviceModel = new JSONModel(Device);
      oDeviceModel.setDefaultBindingMode("OneWay");
      this.setModel(oDeviceModel, "device"); // create the views based on the url/hash

      this.getRouter().initialize();
    },
    openHelloDialog: function openHelloDialog() {
      var _this = this;

      var oView = this.getAggregation("rootControl"); // create dialog lazily

      if (!this._dialog) {
        var oFragmentController = {
          onCloseDialog: function onCloseDialog() {
            _this._dialog.close();
          }
        }; // create dialog via fragment factory

        this._dialog = createHelloDialog(oFragmentController); // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(this._dialog); // forward compact/cozy style into dialog

        jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, this._dialog);
      }

      this._dialog.open();
    },
    getContentDensityClass: function getContentDensityClass() {
      if (!this._sContentDensityClass) {
        if (!sap.ui.Device.support.touch) {
          this._sContentDensityClass = "sapUiSizeCompact";
        } else {
          this._sContentDensityClass = "sapUiSizeCozy";
        }
      }

      return this._sContentDensityClass;
    }
  });
  _default = Object.assign(Component, _default);
  return _default;
})