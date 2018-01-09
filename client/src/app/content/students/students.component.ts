import {Component, OnInit, ViewChild} from "@angular/core";
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

@Component({
  selector: "gl-alumnos",
  templateUrl: "./students.component.html"
})
export class StudentsComponent implements OnInit {

  @ViewChild("confirmModal") confirmModal: ConfirmationModalComponent;

  title: string = "All Students";
  students: Observable<Student[]>;
  isAdministrator: boolean;
  modalData: ConfirmationData;
  alert: ContentAlert;

  private studentsPath: string = globalProperties.studentsPath;

  constructor(private contentService: ContentService,
              private authService: AuthService) {}

  ngOnInit() {
    this.fetchContent();
    this.isAdministrator = this.authService.isAdministrator();
  }

  fetchContent() {
    this.students = this.contentService
      .getContent<Student[]>(this.studentsPath)
      .catch(error => Observable.throw(error));
  }

  onDetails(entity: Student) {
    console.log("view details of: ", entity);
  }

  onEdit(entity: Student) {
    console.log("edit details of: ", entity);
  }

  onDelete(student: Student) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the element ?",
      action: this.delete(student)
    };
    this.confirmModal.open();
  }

  private delete(student: Student) {
    return () => {
      this.contentService.deleteContent<MessageResponse>(this.studentsPath, student.id)
        .map((response: MessageResponse) => {
          this.alert = {type: "success", message: response.message};
          this.fetchContent();
        })
        .catch(error => {
          this.alert = {type: "danger", message: error};
          return Observable.throw(error);
        })
        .subscribe();
    }
  }

}
