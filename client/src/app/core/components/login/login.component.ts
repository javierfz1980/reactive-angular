import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Token} from "../../../models/api/token";
import {Subscription} from "rxjs/Subscription";
import {AuthService} from "../../providers/services/auth.service";
import {appRoutePaths} from "../../../app-routing.module";

@Component({
  selector: "gl-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  wrongCredentials: boolean = false;
  private loginSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {

    if (this.authService.isAuthorized())
        this.router.navigate([appRoutePaths.dashboard.path]);
  }

  ngOnInit() {
    this.form = new FormGroup({
      "username": new FormControl(null, [Validators.required, Validators.email]),
      "password": new FormControl(null, [Validators.required])
    })
  }

  onSubmit() {
    this.loginSubscription = this.authService
      .login(this.form.value)
      .subscribe((response: Token) => {
        this.router.navigate([appRoutePaths.dashboard.path])
      });
  }

  ngOnDestroy() {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
  }

}
