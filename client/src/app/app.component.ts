import {Component, OnInit} from "@angular/core";
import {AuthService} from "./common/services/auth.service";
import {Observable} from "rxjs/Observable";
import {LoginState} from "./common/models/login-state";

@Component({
  selector: 'gl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isAuthorized: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthorized = this.authService
      .getAuthState()
  }
}
