import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../models/student";
import {ContentService} from "../../core/providers/services/content.service";
import {globalProperties} from "../../../environments/properties";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {MessageResponse} from "../../models/api/message-response";
import {ContentAlert} from "../commons/content-alert/content-alert.component";
import {Subscription} from "rxjs/Subscription";
import {Observer} from "rxjs/Observer";

@Component({
  selector: "gl-alumnos",
  templateUrl: "./students.component.html"
})
export class StudentsComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal") confirmModal: ConfirmationModalComponent;

  title: string = "All Students";
  students: Observable<Student[]>;
  isAdministrator: boolean;
  modalData: ConfirmationData;
  alert: ContentAlert;

  private studentsPath: string = globalProperties.studentsPath;
  private subscription: Subscription;

  constructor(private contentService: ContentService,
              private authService: AuthService) {}

  ngOnInit() {
    this.fetchContent();
    this.isAdministrator = this.authService.isAdministrator();
  }

  private fetchContent() {
    this.students = this.contentService
      .getContent<Student[]>(this.studentsPath)
      .catch(error => Observable.throw(error));
  }

  details(entity: Student) {
    console.log("view details of: ", entity);
  }

  edit(entity: Student) {
    console.log("edit details of: ", entity);
  }

  delete(student: Student) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscription = this.contentService
          .deleteContent<MessageResponse>(this.studentsPath, student.id)
          .subscribe(
            (response: MessageResponse) => {
              this.alert = {type: "success", message: response.message, time: 3000};
              this.modalData.isBusy = false;
              this.fetchContent();
            },
            (error: any) => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
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
