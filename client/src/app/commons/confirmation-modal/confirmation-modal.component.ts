import {Component, Input} from "@angular/core";

export type ConfirmationModalType = "delete" | "confirm" | "response";
export interface ConfirmationModalData {
  title: string;
  text: string;
  action?: () => void;
  type: ConfirmationModalType;
  isBusy?: boolean;
}

@Component({
  selector: "gl-confirmation-modal",
  templateUrl: "./confirmation-modal.component.html"
})
export class ConfirmationModalComponent {

  opened: boolean = false;
  _modalData: ConfirmationModalData;

  @Input()
  set modalData(data: ConfirmationModalData) {
    this._modalData = data;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  onOkClicked() {
    if (this._modalData.action) this._modalData.action();
  }

}
