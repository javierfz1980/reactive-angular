import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";
import 'rxjs/add/operator/takeWhile';

export class BasicContentDisplayNavigator<T> extends BasicModalConfirmActions {

  protected isAdministrator: boolean;
  protected createPath: string;
  protected editPath: string;

  constructor(protected authService: AuthService,
              protected router: Router,
              protected route: ActivatedRoute) {
    super();
    this.isAdministrator = this.authService.isAdministrator();
  }

  create() {
    if (this.createPath)
      this.router.navigate([this.createPath], {relativeTo: this.route})
  }

  edit(data: T) {
    if (this.editPath)
      this.router.navigate([this.editPath, data["id"]], { queryParams: { edit: true}});
  }

  details(data: T) {
    if (this.editPath)
      this.router.navigate([this.editPath, data["id"]]);
  }

}
