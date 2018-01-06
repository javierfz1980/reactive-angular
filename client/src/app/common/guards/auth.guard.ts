import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {routePaths} from "../../app-routing.module";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,) {}

  /**
   * Validates if user is Authorized. If not it redirects to login page.
    * @returns {boolean}
   */
  canActivate(): boolean {
    if (this.authService.isAuthorized()) {
      return true;
    } else {
      this.router.navigate([routePaths.login.route]);
      return false;
    }
  }


}
