import {
  ConfirmationModalComponent,
  ConfirmationModalData
} from "../../../commons/confirmation-modal/confirmation-modal.component";

export abstract class BasicModalConfirmActions {

  abstract confirmModal: ConfirmationModalComponent;
  abstract action: () => void;

  protected modalData: ConfirmationModalData;

  protected openCreateConfirmation() {
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this element ?",
      action: this.action
    };
    this.confirmModal.open();
  }

  protected openDeleteConfirmation(data?: string) {
    const detail: string = data ? `(${data}) ?` : "?";
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: `Are you sure you want to delete this element ${detail}`,
      action: this.action
    };
    this.confirmModal.open();
  }

  protected openToggleStatusConfirmation(data?: string) {
    const detail: string = data ? `(${data}) ?` : "?";
    this.modalData = {
      type: "confirm",
      title: "Change Status",
      text: `Are you sure you want to change this element ${detail}`,
      action: this.action
    };
    this.confirmModal.open();
  }

  protected openUpdateConfirmation1(data?: string) {
    const detail: string = data ? `(${data}) ?` : "?";
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: `Are you sure you want to update this element ${detail}`,
      action: this.action
    };
    this.confirmModal.open();
  }

}
