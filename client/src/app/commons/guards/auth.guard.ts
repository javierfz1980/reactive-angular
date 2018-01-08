import {CanActivate, CanLoad, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {routePaths} from "../../app-routing.module";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router,) {}

  canActivate(): Observable<boolean> | boolean {
    return this.isAuthorized();
  }

  canLoad(): Observable<boolean> | boolean {
    return this.isAuthorized();
  }

  /**
   * Validates if user is Authorized. If not it redirects to login page.
   * @returns {boolean}
   */
  private isAuthorized(): Observable<boolean> | boolean {
    if (this.authService.isAuthorized()) {
      return (this.authService.getAccount()) ? true : this.authService.loginByToken();
    } else {
      this.router.navigate([routePaths.login.route]);
      return false;
    }
  }


}
