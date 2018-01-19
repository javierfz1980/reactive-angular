import {Component, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {Account} from "../../../../models/core/account";
import {appRoutePaths} from "../../../../app-routing.module";
import {Router} from "@angular/router";
import {AccountDetailsModalComponent} from "./account-details-modal/account-details-modal.component";

@Component({
  selector: "gl-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {

  @ViewChild("accountModal")
  accountModal: AccountDetailsModalComponent;

  account: Observable<Account>;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.account = (<Observable<Account>>this.authService.getAccount(true));
  }

  showAccountInfo() {
    this.accountModal.open();
  }

  logout() {
    this.authService.logout();
    this.router.navigate([appRoutePaths.login.path]);
  }

}
