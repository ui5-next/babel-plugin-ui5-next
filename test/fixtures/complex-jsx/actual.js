
import JSView from "sap/ui/JSView"
import Button from "sap/m/Button"
import HTML from "sap/m/HTML"

export default class AView extends JSView {

  onPress() {
    // do nothing
  }

  createPart() {
    this._hideButton = <Button name="1"></Button>
    return <HTML class="htmlStyle" value={<div class="nameStyle" />}>{this._hideButton}</HTML>
  }

  createContent() {
    return <Button class="btnClass1" onPress={this.onPress.bind(this)}>Text Here</Button>
  }

}