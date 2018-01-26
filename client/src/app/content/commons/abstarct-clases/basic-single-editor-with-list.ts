import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {ViewChild} from "@angular/core";
import {
  ConfirmationModalComponent,
  ConfirmationModalData
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";

export class BasicSingleEditorWithList<T, G, Z> extends BasicModalConfirmActions {

  @ViewChild("confirmModal")
  protected confirmModal: ConfirmationModalComponent;

  @ViewChild("listForm")
  listForm: G;

  protected isAdministrator: boolean;
  protected editMode: boolean = false;
  protected modalData: ConfirmationModalData;
  protected action: () => void;

  protected source: Observable<T>;
  protected id: Observable<string>;
  protected listFormSource: Observable<Z[]>;
  protected listFormMarked: Observable<string[]>;
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

}
