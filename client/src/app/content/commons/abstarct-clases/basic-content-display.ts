import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";
import {Observable} from "rxjs/Observable";
import {StoreData} from "../../../models/core/store-data";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {OnInit} from "@angular/core";
import 'rxjs/add/operator/takeWhile';

export abstract class BasicContentDisplay<T> extends BasicModalConfirmActions<T> implements OnInit{

  protected createPath: string;
  protected editPath: string;
  protected contentProvider: () => Observable<StoreData<T>>;
  protected fetchProvider: (id: string) => void;
  protected dataSource: Observable<StoreData<T>>;
  protected isAdministrator: boolean;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService);
    this.isAdministrator = this.authService.isAdministrator();
  }

  ngOnInit() {
    if (this.contentProvider && this.fetchProvider) {
      this.dataSource = this.contentProvider.bind(this.contentService)()
      this.fetchProvider.bind(this.contentService)();
    }
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
