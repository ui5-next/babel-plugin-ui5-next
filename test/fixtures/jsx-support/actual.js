
import JSView from "sap/ui/JSView"
import Button from "sap/m/Button"

export default class AView extends JSView {

  onPress() {
    // do nothing
  }

  createContent() {
    return <Button class="btnClass1" onPress={this.onPress.bind(this)}>Text Here</Button>
  }

}