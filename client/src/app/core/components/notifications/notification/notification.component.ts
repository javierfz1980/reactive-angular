import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Alert} from "../../../../models/core/alert";


@Component({
  selector: "gl-alert",
  templateUrl: "./notification.component.html"
})
export class NotificationComponent {

  @Output("onRead")
  readEvent: EventEmitter<Alert> = new EventEmitter<Alert>();

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
    this.readEvent.emit(this.alert);
    this.closed = true;
  }
}
