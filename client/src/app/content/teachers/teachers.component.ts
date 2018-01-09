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
import {Observer} from "rxjs/Observer";

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

  details(entity: Teacher) {
    console.log("view details of: ", entity);
  }

  edit(entity: Teacher) {
    console.log("edit details of: ", entity);
  }

  delete(teacher: Teacher) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Teacher ?",
      action: () => {
        this.busy = true;
        this.subscription = this.contentService
          .deleteContent<MessageResponse>(this.teachersPath, teacher.id)
          .subscribe(
            (response: MessageResponse) => {
              this.busy = false;
              this.alert = {type: "success", message: response.message, time: 3000};
              this.fetchContent();
            },
            (error: any) => {
              this.busy = false;
              this.alert = {type: "danger", message: error.message, time: 3000};
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
