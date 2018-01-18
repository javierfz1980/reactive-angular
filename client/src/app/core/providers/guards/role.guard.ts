import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {appRoutePaths} from "../../../app-routing.module";

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAdministrator()) {
      this.router.navigate([appRoutePaths.dashboard.path])
    }
    return true;
  }
}
