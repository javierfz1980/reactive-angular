import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {StoreData} from "../../../models/core/store-data";
import 'rxjs/add/operator/withLatestFrom';

export abstract class BasicContentEditor<T> extends BasicModalConfirmActions<T> {

  protected contentProvider: () => Observable<StoreData<T>>;
  protected fetchProvider: (id: string) => void;
  protected id: Observable<string>;

  dataSource: Observable<T>;
  isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAdministrator: boolean;
  editMode: boolean = false;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService);
  }

  protected ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();
    this.isEditMode.next((this.isAdministrator && this.editMode));

    if (this.fetchProvider && this.contentProvider) {
      this.id = this.route.params
        .map((params: Params) => {
          this.fetchProvider.bind(this.contentService)(params.id);
          return params.id;
        });

      this.dataSource = this.contentProvider.bind(this.contentService)()
        .filter(storeData => Boolean(storeData["data"]))
        .withLatestFrom(this.id)
        .map(([storeData, id]) => storeData["data"].find((data: T) => data["id"] === id))
        .filter((data: T) => Boolean(data));
    } else {
      this.dataSource = Observable.empty();
    }

  }

  protected toggleEditMode() {
    this.editMode = !this.editMode;
    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

}
