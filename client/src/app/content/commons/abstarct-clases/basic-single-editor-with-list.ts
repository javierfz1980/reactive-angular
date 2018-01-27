import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {
  ConfirmationModalComponent,
  ConfirmationModalData
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";

export abstract class BasicSingleEditorWithList<T, G, Z> extends BasicModalConfirmActions {

  abstract confirmModal: ConfirmationModalComponent;
  abstract listForm: G;

  protected modalData: ConfirmationModalData;
  protected action: () => void;
  protected source: Observable<T>;
  protected id: Observable<string>;
  protected listFormSource: Observable<Z[]>;
  protected listFormMarked: Observable<string[]>;
  protected isAdministrator: boolean;
  protected editMode: boolean = false;
  protected isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(protected authService: AuthService,
              protected route: ActivatedRoute) {
    super();
  }

  protected ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();
    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  protected toggleEditMode() {
    this.editMode = !this.editMode;
    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

}
