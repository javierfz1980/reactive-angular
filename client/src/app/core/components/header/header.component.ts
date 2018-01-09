import {Component} from "@angular/core";
import {AuthService} from "../../providers/services/auth.service";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";

@Component({
  selector: "gl-header",
  templateUrl: "./header.component.html",
  styles: []
})
export class HeaderComponent {

  readonly headerTitle: string = "Reactive Angular - GL";

  constructor(private authService: AuthService,
              private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate([appRoutePaths.login.path]);
  }

}
