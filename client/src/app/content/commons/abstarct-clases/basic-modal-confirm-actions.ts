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

export abstract class BasicModalConfirmActions<T> extends BasicSubscriptor {

  @ViewChild("confirmModal")
  abstract confirmModal: ConfirmationModalComponent;
  protected action: () => void;

  protected createProvider: (data: T, selectedItems: string[]) => Observable<boolean>;
  protected updateProvider: (data: T, toBeRemoved: string[], toBeAdded: string[]) => Observable<boolean>;
  protected updateStatusProvider: (id: string, data: boolean) => Observable<boolean>;
  protected deleteProvider: (data: T) => Observable<boolean>;

  modalData: ConfirmationModalData;

  constructor(protected router: Router,
              protected contentService: ContentService) {
    super();
  }

  update(data: T, elementsTobeRemoved: string[], elementsTobeAdded: string[]) {
    const detail: string = data ? `(${data["id"]}) ?` : "?";
    if (this.updateProvider) {
      this.updateProvider = this.updateProvider.bind(this.contentService);
      this.action = () => {
        this.modalData.title = "Updating";
        this.modalData.isBusy = true;
        this.updateProvider(data, elementsTobeRemoved, elementsTobeAdded)
          .takeWhile(() => true)
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

  toggleStatus(data: T) {
    const detail: string = data ? `(${data["id"]}) ?` : "?";
    if (this.updateStatusProvider) {
      this.updateStatusProvider = this.updateStatusProvider.bind(this.contentService);
      this.action = () => {
        this.modalData.title = "Updating";
        this.modalData.isBusy = true;
        this.contentService
          .updateCourseStatus(data["id"], !data["active"])
          .takeWhile(() => true)
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

  delete(data: T, redirectPath?: string) {
    const detail: string = data ? `(${data["id"]}) ?` : "?";
    if (this.deleteProvider) {
      this.deleteProvider = this.deleteProvider.bind(this.contentService);
      this.action = () => {
        this.modalData.title = "Deleting";
        this.modalData.isBusy = true;
        this.deleteProvider(data)
          .takeWhile(() => true)
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

  create(data: T, selectedItems: string[], redirectPath: string) {
    if (this.createProvider) {
      this.createProvider = this.createProvider.bind(this.contentService);
      this.action = () => {
        this.modalData.title = "Creating";
        this.modalData.isBusy = true;
        this.createProvider(data, selectedItems)
          .takeWhile(() => true)
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
