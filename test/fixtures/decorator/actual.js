import JSView from "sap/ui/JSView";
import Button from "sap/m/Button";

const connect = target => target;
const highConnect = value => () => value;

@connect
@highConnect(1)
class AView extends JSView {
  init() {
    super.init();
  }

  onPress() {
    // do nothing
  }

  createContent() {
    return (
      <Button class="btnClass1" onPress={this.onPress}>
        Text Here
      </Button>
    );
  }

  getControllerName() {
    return "custom.Controller";
  }
}

export default AView;
