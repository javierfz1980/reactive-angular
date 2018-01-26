import {
  ConfirmationModalComponent,
  ConfirmationModalData
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {ViewChild} from "@angular/core";
import {getDifferencesBetween} from "../../../helpers/helpers";

export class BasicModalConfirmActions {

  @ViewChild("confirmModal")
  protected confirmModal: ConfirmationModalComponent;

  protected elementsTobeRemoved: string[];
  protected elementsTobeAdded: string[];
  protected modalData: ConfirmationModalData;
  protected action: () => void;

  protected openDeleteConfirmation() {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this element?",
      action: this.action
    };
    this.confirmModal.open();
  }

  protected openToggleStatusConfirmation() {
    this.modalData = {
      type: "confirm",
      title: "Change",
      text: "Are you sure you want to change this element?",
      action: this.action
    };
    this.confirmModal.open();
  }

  protected openUpdateConfirmation(sourceElements: string[], newElements: string[]) {
    this.elementsTobeRemoved = getDifferencesBetween<string>(sourceElements ? sourceElements : [], newElements);
    this.elementsTobeAdded = getDifferencesBetween<string>(newElements, sourceElements ? sourceElements : []);
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this element?",
      action: this.action
    };
    this.confirmModal.open();
  }

}
