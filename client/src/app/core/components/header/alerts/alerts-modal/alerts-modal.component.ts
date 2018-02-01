import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {Alert} from "../../../../../models/core/alert";
import {getDateString} from "../../../../../helpers/helpers";

@Component({
  selector: "gl-alerts-modal",
  templateUrl: "./alerts-modal.component.html",
  styleUrls: ["./alerts-modal.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertsModalComponent {

  @Input()
  alert: Alert;

  @Output("onDelete")
  deleteEmitter: EventEmitter<Alert> = new EventEmitter<Alert>();

  opened: boolean;

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  getDate(date: string): string {
    return getDateString(date);
  }

  delete() {
    this.deleteEmitter.emit(this.alert);
    this.close();
  }
}
