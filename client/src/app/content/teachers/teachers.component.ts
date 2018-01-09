import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Teacher} from "../../models/teacher";
import {globalProperties} from "../../../environments/properties";
import {Observable} from "rxjs/Observable";
import {ContentService} from "../../core/providers/services/content.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {Student} from "../../models/student";
import {MessageResponse} from "../../models/api/message-response";
import {ContentAlert} from "../commons/content-alert/content-alert.component";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: "gl-profesores",
  templateUrl: "./teachers.component.html"
})
export class TeachersComponent implements OnInit, OnDestroy  {

  @ViewChild("confirmModal") confirmModal: ConfirmationModalComponent;

  title: string = "All Teachers";
  teachers: Observable<Teacher[]>;
  isAdministrator: boolean;
  modalData: ConfirmationData;
  alert: ContentAlert;
  busy: boolean = false;

  private teachersPath: string = globalProperties.teachersPath;
  private subscription: Subscription;

  constructor(private authService: AuthService,
              private contentService: ContentService) {}

  ngOnInit() {
    this.fetchContent();
    this.isAdministrator = this.authService.isAdministrator();
  }

  fetchContent() {
    this.teachers = this.contentService
      .getContent<Teacher[]>(this.teachersPath)
      .catch(error => Observable.throw(error));
  }

  onDetails(entity: Teacher) {
    console.log("view details of: ", entity);
  }

  onEdit(entity: Teacher) {
    console.log("edit details of: ", entity);
  }

  onDelete(teacher: Teacher) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the element ?",
      action: this.delete(teacher)
    };
    this.confirmModal.open();
  }

  private delete(teacher: Teacher) {
    return () => {
      this.busy = true;
      this.subscription = this.contentService.deleteContent<MessageResponse>(this.teachersPath, teacher.id)
        .map((response: MessageResponse) => {
          this.alert = {type: "success", message: response.message};
          this.busy = false;
          this.fetchContent();
        })
        .catch(error => {
          this.busy = false;
          this.alert = {type: "danger", message: error};
          return Observable.throw(error);
        })
        .subscribe();
    }
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
