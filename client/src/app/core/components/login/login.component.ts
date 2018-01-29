import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Token} from "../../../models/api/token";
import {AuthService} from "../../providers/services/auth.service";
import {appRoutePaths} from "../../../app-routing.module";
import {BasicSubscriptor} from "../../../commons/abstract-classes/basic-subscriptor";

@Component({
  selector: "gl-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent extends BasicSubscriptor implements OnInit {

  form: FormGroup;
  wrongCredentials: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService,
              private router: Router) {
    super();
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
    this.loading = true;
    this.authService
      .login(this.form.value)
      .takeWhile(() => this.isAlive)
      .subscribe(() => {
        this.loading = false;
        this.router.navigate([appRoutePaths.dashboard.path])
      });
  }


}
