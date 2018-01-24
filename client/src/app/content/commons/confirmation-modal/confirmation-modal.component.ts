import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {Student} from "../../../models/content/student";
import {Teacher} from "../../../models/content/teacher";
import {Course} from "../../../models/content/course";

export type ConfirmationType = "delete" | "confirm" | "response";
export interface ConfirmationData {
  title: string;
  text: string;
  action: () => void;
  type: ConfirmationType;
  isBusy?: boolean;
}

@Component({
  selector: "gl-confirmation-modal",
  templateUrl: "./confirmation-modal.component.html"
})
export class ConfirmationModalComponent {

  opened: boolean = false;
  data: ConfirmationData;

  @Input()
  set modalData(data: ConfirmationData) {
    this.data = data;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  onOkClicked() {
    if (this.data.action) this.data.action();
  }

}
