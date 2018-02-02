import {
  ConfirmationModalComponent,
  ConfirmationModalData
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {Router} from "@angular/router";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {BasicSubscriptor} from "../../../commons/abstract-classes/basic-subscriptor";
import {ViewChild} from "@angular/core";
import 'rxjs/add/operator/filter';

/**
 * Base class that provide the basic functionalities for components that needs to trigger some basic
 * actions which had to be confirmed by a modal.
 * The three generic types for this class are Course, Student or Teacher.
 */
export abstract class BasicModalConfirmActions<T> extends BasicSubscriptor {

  /**
   * Every component that extends this class has to have a requiered ConfirmationModalComponent in
   * order to work.
   */
  @ViewChild("confirmModal")
  abstract confirmModal: ConfirmationModalComponent;

  /**
   * The action that will be executed on modal confirmation.
   */
  protected action: () => void;

  /**
   * The provider service method for create action.
   */
  protected createProvider: (data: T, selectedItems: string[]) => Observable<boolean>;

  /**
   * The provider service method for update action.
   */
  protected updateProvider: (data: T, toBeRemoved: string[], toBeAdded: string[]) => Observable<boolean>;

  /**
   * The provider service method for update status action.
   */
  protected updateStatusProvider: (id: string, data: boolean) => Observable<boolean>;

  /**
   * The provider service method for delete action.
   */
  protected deleteProvider: (data: T) => Observable<boolean>;

  /**
   * The data that will be shown on the modal.
   */
  modalData: ConfirmationModalData;

  constructor(protected router: Router,
              protected contentService: ContentService) {
    super();
  }

  /**
   * Update action confirm implementation:
   * 1- shows initial modal confirmation info.
   * 2- on confirm change the modal to a waiting state.
   * 3- when action is finished it close the modal.
   * @param {T} data
   * @param {string[]} elementsTobeRemoved
   * @param {string[]} elementsTobeAdded
   */
  update(data: T, elementsTobeRemoved: string[], elementsTobeAdded: string[]) {
    const detail: string = data ? `(${data["id"]}) ?` : "?";
    if (this.updateProvider) {
      this.updateProvider = this.updateProvider.bind(this.contentService);
      this.action = () => {
        this.modalData.title = "Updating";
        this.modalData.isBusy = true;
        this.updateProvider(data, elementsTobeRemoved, elementsTobeAdded)
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData = {
                ...this.modalData,
                isBusy: false
              };
              this.confirmModal.close();
            });
      };
    } else {
      this.action = () => {}
    }
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: `Are you sure you want to update this element ${detail}`,
      action: this.action
    };
    this.confirmModal.open();
  }

  /**
   * Update Status action confirm implementation:
   * 1- shows initial modal confirmation info.
   * 2- on confirm change the modal to a waiting state.
   * 3- when action is finished it close the modal.
   * @param {T} data
   */
  toggleStatus(data: T) {
    const detail: string = data ? `(${data["id"]}) ?` : "?";
    if (this.updateStatusProvider) {
      this.updateStatusProvider = this.updateStatusProvider.bind(this.contentService);
      this.action = () => {
        this.modalData.title = "Updating";
        this.modalData.isBusy = true;
        this.contentService
          .updateCourseStatus(data["id"], !data["active"])
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData = {
                ...this.modalData,
                isBusy: false
              };
              this.confirmModal.close();
            })
      };
    } else {
      this.action = () => {}
    }
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: `Are you sure you want to update this element ${detail}`,
      action: this.action
    };
    this.confirmModal.open();
  }

  /**
   * Delte action confirm implementation:
   * 1- shows initial modal confirmation info.
   * 2- on confirm change the modal to a waiting state.
   * 3- when action is finished it close the modal or redirects to another path.
   * @param {T} data
   * @param {string} redirectPath
   */
  delete(data: T, redirectPath?: string) {
    const detail: string = data ? `(${data["id"]}) ?` : "?";
    if (this.deleteProvider) {
      this.deleteProvider = this.deleteProvider.bind(this.contentService);
      this.action = () => {
        this.modalData.title = "Deleting";
        this.modalData.isBusy = true;
        this.deleteProvider(data)
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData = {
                ...this.modalData,
                isBusy: false
              };
              this.confirmModal.close();
              if (redirectPath) this.router.navigate([redirectPath]);
            });
      };
    } else {
      this.action = () => {}
    }
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: `Are you sure you want to delete this element ${detail}`,
      action: this.action
    };
    this.confirmModal.open();
  }

  /**
   * Create action confirm implementation:
   * 1- shows initial modal confirmation info.
   * 2- on confirm change the modal to a waiting state.
   * 3- when action is finished it close the modal or redirects to another path.
   * @param {T} data
   * @param {string[]} selectedItems
   * @param {string} redirectPath
   */
  create(data: T, selectedItems: string[], redirectPath: string) {
    if (this.createProvider) {
      this.createProvider = this.createProvider.bind(this.contentService);
      this.action = () => {
        this.modalData.title = "Creating";
        this.modalData.isBusy = true;
        this.createProvider(data, selectedItems)
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData = {
                ...this.modalData,
                isBusy: false
              };
              this.confirmModal.close();
              this.router.navigate([redirectPath]);
            });
      };
    } else {
      this.action = () => {}
    }
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this element ?",
      action: this.action
    };
    this.confirmModal.open();
  }

}
