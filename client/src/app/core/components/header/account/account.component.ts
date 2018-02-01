import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {Account} from "../../../../models/core/account";
import {Router} from "@angular/router";
import {AccountDetailsModalComponent} from "./account-details-modal/account-details-modal.component";
import {appRoutePaths} from "../../../../app-routes";

@Component({
  selector: "gl-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit {

  @ViewChild("accountModal")
  accountModal: AccountDetailsModalComponent;

  account: Observable<Account>;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.account = this.authService.account;
  }

  showAccountInfo() {
    this.accountModal.open();
  }

  logout() {
    this.authService.logout();
    this.router.navigate([appRoutePaths.login.path]);
  }

  getNewReference(info: Account): Account {
    return {...info};
  }

}
