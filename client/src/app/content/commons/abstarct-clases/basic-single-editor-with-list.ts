import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {BasicSubscriptor} from "./basic-subscriptor";
import {ViewChild} from "@angular/core";
import {
  ConfirmationModalComponent,
  ConfirmationModalData
} from "../confirmation-modal/confirmation-modal.component";
import {getDifferencesBetween} from "../../../helpers/helpers";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class BasicSingleEditorWithList<T, G, Z> extends BasicSubscriptor {

  @ViewChild("confirmModal")
  protected confirmModal: ConfirmationModalComponent;

  @ViewChild("listForm")
  listForm: G;

  protected isAdministrator: boolean;
  protected editMode: boolean = false;
  protected modalData: ConfirmationModalData;
  protected action: () => void;
  protected elementsTobeRemoved: string[];
  protected elementsTobeAdded: string[];

  protected source: Observable<T>;
  protected id: Observable<string>;
  protected listFormSource: Observable<Z[]>;
  protected listFormMarkeds: Observable<string[]>;
  protected isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(protected authService: AuthService,
              protected route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();
    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  protected toggleEditMode() {
    this.editMode = !this.editMode;
    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  protected openDeleteModal() {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this element?",
      action: this.action
    };
    this.confirmModal.open();
  }

  protected openUpdateModal(sourceElements: string[], newElements: string[]) {
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
