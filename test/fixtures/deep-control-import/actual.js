
import JSView from "sap/ui/JSView"
import MonacoEditor from "./table";

export default class AView extends JSView {

  onPress() {
    // do nothing
  }

  createEditor() {
    return <MonacoEditor></MonacoEditor>
  }

}