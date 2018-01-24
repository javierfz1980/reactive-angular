import {Component, Input, ViewChild} from "@angular/core";
import {
  ConfirmationModalComponent
} from "../../../../../content/commons/confirmation-modal/confirmation-modal.component";
import {Account} from "../../../../../models/core/account";

@Component({
  selector: "gl-account-details-modal",
  templateUrl: "./account-details-modal.component.html",
  styleUrls: ["./account-details-modal.component.css"]
})
export class AccountDetailsModalComponent {

  @ViewChild("modal") modal: ConfirmationModalComponent;

  @Input()
  set modalData(data: Account) {
    this.data = data;
  }

  data: Account;

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }


}
