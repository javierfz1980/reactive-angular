import {Component, Input} from "@angular/core";
import {Alert} from "../../../../../models/core/alert";

@Component({
  selector: "gl-alerts-modal",
  templateUrl: "./alerts-modal.component.html"
})
export class AlertsModalComponent {

  @Input()
  alert: Alert;

  opened: boolean;

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }
}
