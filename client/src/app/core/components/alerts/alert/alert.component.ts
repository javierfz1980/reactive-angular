import {Component, Input} from "@angular/core";
import {Alert} from "../../../../models/core/alert";


@Component({
  selector: "gl-alert",
  templateUrl: "./alert.component.html"
})
export class AlertComponent {

  @Input()
  set data(content: Alert) {
    this.alert = content;
    this.closed = false;
    if (content.duration) {
      setTimeout(() => {
        this.onClose();
      }, content.duration);
    }
  }

  closed: boolean = true;
  alert: Alert;

  onClose() {
    this.alert.read = true;
    this.closed = true;
  }
}
