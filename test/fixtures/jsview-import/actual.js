import JSView from "sap/ui/core/mvc/JSView"
import HomePage from "./HomePage";

export default class AView extends JSView {

  createContent() {
    return <HomePage data={1} />
  }

}