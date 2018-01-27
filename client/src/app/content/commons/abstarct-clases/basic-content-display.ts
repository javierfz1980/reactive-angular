import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/takeWhile';
import {StoreData} from "../../../core/providers/services/content/basic-content.service";

export abstract class BasicContentDisplay<T> extends BasicModalConfirmActions {

  abstract createPath: string;
  abstract editPath: string;

  protected dataSource: Observable<StoreData<T>>;
  protected isAdministrator: boolean;

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
      this.router.navigate([this.editPath, data["id"]], {queryParams: {edit: true}});
  }

  details(data: T) {
    if (this.editPath)
      this.router.navigate([this.editPath, data["id"]]);
  }

  protected trackByItem(index: number, item: T): string {
    return item["id"];
  }

}