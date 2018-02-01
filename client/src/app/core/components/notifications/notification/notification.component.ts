import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {Alert} from "../../../../models/core/alert";


@Component({
  selector: "gl-alert",
  templateUrl: "./notification.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {

  @Output("onRead")
  readEvent: EventEmitter<Alert> = new EventEmitter<Alert>();

  @Input()
  set alert(data: Alert) {
    this._alert = data;
    this.closed = false;
    if (data.duration) {
      setTimeout(() => {
        this.onClose();
      }, data.duration);
    }
  }

  closed: boolean = true;
  _alert: Alert;

  onClose() {
    this.readEvent.emit(this._alert);
    this.closed = true;
  }
}
