import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {Student} from "../../../models/student";
import {Teacher} from "../../../models/teacher";
import {Course} from "../../../models/course";

export type ConfirmationType = "delete" | "confirm";
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

  @ViewChild("modal") modal: ConfirmationModalComponent;
  //@Output('onConfirm') onConfirm: EventEmitter<Student | Teacher | Course>;

  data: ConfirmationData;

  @Input()
  set modalData(data: ConfirmationData) {
    this.data = data;
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  onOkClicked() {
    if (this.data.action) this.data.action();
    //this.modal.close();
  }

}
