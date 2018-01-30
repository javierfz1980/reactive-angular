import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {BasicModalConfirmActions} from "./basic-modal-confirm-actions";

export abstract class BasicContentEditor<T> extends BasicModalConfirmActions {

  protected dataSource: Observable<T>;
  protected id: Observable<string>;
  protected isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected isAdministrator: boolean;
  protected editMode: boolean = false;

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
