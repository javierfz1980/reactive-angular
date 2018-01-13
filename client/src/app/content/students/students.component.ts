import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../models/student";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {ContentAlert} from "../commons/alert/content-alert.component";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../app-routing.module";
import {StudentsService} from "../../core/providers/services/content/students.service";

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

  private subscription: Subscription;

  constructor(private studentsService: StudentsService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.fetchContent();
    this.isAdministrator = this.authService.isAdministrator();
  }

  private fetchContent() {
    this.students = this.studentsService
      .getStudents()
      .catch(error => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      });
  }

  details(student: Student) {
    this.router.navigate([appRoutePaths.students.path, student.id]);
  }

  delete(student: Student) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscription = this.studentsService.deleteStudent(student)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.fetchContent();
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
