import {ChangeDetectionStrategy, Component, Input, ViewChild} from "@angular/core";
import {
  ConfirmationModalComponent
} from "../../../../../commons/confirmation-modal/confirmation-modal.component";
import {Account} from "../../../../../models/core/account";

@Component({
  selector: "gl-account-details-modal",
  templateUrl: "./account-details-modal.component.html",
  styleUrls: ["./account-details-modal.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDetailsModalComponent {

  @ViewChild("modal") modal: ConfirmationModalComponent;

  @Input()
  modalData: Account;

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }


}
