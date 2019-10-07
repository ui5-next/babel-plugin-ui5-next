import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import { manifest } from "./manifest";

export default class Component extends UIComponent {

  static metadata = { manifest };

  public init() {
    super.init(this, arguments);
    var oData = {
      recipient: {
        name: "World"
      }
    } as any;
    var oModel = new JSONModel(oData);
    this.setModel(oModel);

    this.getRouter().initialize();
  }
}