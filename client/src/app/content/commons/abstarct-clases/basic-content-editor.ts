import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {StoreData} from "../../../models/core/store-data";
import 'rxjs/add/operator/withLatestFrom';

/**
 * Base class that provide the basic functionalities for components that edits or creates new
 * Courses, Students and/or Teachers.
 * The three generic types for this class are Course, Student or Teacher.
 */
export abstract class BasicContentEditor<T> extends BasicModalConfirmActions<T> {

  /**
   * The provider service method for the subscription to the data that has to be displayed.
   */
  protected contentProvider: () => Observable<StoreData<T>>;

  /**
   * The provider service method for fetching data from API.
   */
  protected fetchProvider: (id: string) => void;

  /**
   * The id of the current Element that has to be displayed.
   */
  protected id: Observable<string>;

  /**
   * The data source of the element that has to be displayed.
   */
  dataSource: Observable<T>;

  /**
   * Flag indicator that determines if the element that is being displayed should be editable or not.
   */
  isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The type of role for the current user in order to show or hide some other options.
   */
  isAdministrator: boolean;

  /**
   * Flag indicator that determines if edit mode is on or off.
   */
  editMode: boolean = false;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService);
  }

  /**
   * Based on the content providers and the URL id it fetches the data from the API and it
   * subscribes to the stream in order to show the info of the selected item.
   */
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
