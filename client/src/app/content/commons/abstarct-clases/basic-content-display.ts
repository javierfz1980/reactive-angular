import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";
import {Observable} from "rxjs/Observable";
import {StoreData} from "../../../models/core/store-data";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {OnInit} from "@angular/core";
import 'rxjs/add/operator/takeWhile';

/**
 * Base class that provide the basic functionalities for components that shown the initial lists of
 * Courses, Students or Teachers.
 * The three generic types for this class are Course, Student or Teacher.
 */
export abstract class BasicContentDisplay<T> extends BasicModalConfirmActions<T> implements OnInit{

  /**
   * The destination path for create action
   */
  protected createPath: string;

  /**
   * The destination path for edit action
   */
  protected editPath: string;

  /**
   * The provider service method for the subscription to the data that has to be displayed.
   */
  protected contentProvider: () => Observable<StoreData<T>>;

  /**
   * The provider service method for fetching data from API.
   */
  protected fetchProvider: (id: string) => void;

  /**
   * The data source of the element that has to be displayed.
   */
  dataSource: Observable<StoreData<T>>;

  /**
   * The type of role for the current user in order to show or hide some other options.
   */
  isAdministrator: boolean;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService);
    this.isAdministrator = this.authService.isAdministrator();
  }

  /**
   * Based on the content providers it fetches the data from the API and it
   * subscribes to the stream in order to show the lists of items.
   */
  ngOnInit() {
    if (this.contentProvider && this.fetchProvider) {
      this.dataSource = this.contentProvider.bind(this.contentService)();
      this.fetchProvider.bind(this.contentService)();
    }
  }

  /**
   * Navigates to create path
   */
  create() {
    if (this.createPath)
      this.router.navigate([this.createPath], {relativeTo: this.route})
  }

  /**
   * Navigates to details path with edit mode turned on
   */
  edit(data: T) {
    if (this.editPath)
      this.router.navigate([this.editPath, data["id"]], {queryParams: {edit: true}});
  }

  /**
   * Navigates to details path
   */
  details(data: T) {
    if (this.editPath)
      this.router.navigate([this.editPath, data["id"]]);
  }

  /**
   * Track by function in order to avoid unnecessary DOM refreshes.
   * @param {number} index
   * @param {T} item
   * @returns {string}
   */
  protected trackByItem(index: number, item: T): string {
    return item["id"];
  }

}
