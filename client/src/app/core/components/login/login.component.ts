import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../providers/services/auth.service";
import {BasicSubscriptor} from "../../../commons/abstract-classes/basic-subscriptor";
import {appRoutePaths} from "../../../app-routes";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-login",
  templateUrl: "./login.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
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
