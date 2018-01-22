import {Component, OnDestroy, ViewChild} from "@angular/core";
import {Student} from "../../../models/content/student";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {StudentsService} from "../../../core/providers/services/content/students.service";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";

@Component({
  selector: "gl-create-student",
  templateUrl: "./create-student.component.html"
})
export class CreateStudentComponent implements OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("studentCourses")
  studentCourses: CoursesFormComponent;

  title: string = "Add new Student";
  modalData: ConfirmationData;
  alert: ContentAlert;

  private isAlive: boolean = true;

  constructor(private studentsService: StudentsService,
              private router: Router) {}

  create(data: InfoProfileData) {
    (<Student>data.info).courses = this.studentCourses.getSelectedCourses();
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to createData this new Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.studentsService
          .createData(data.info, data.profile, this.studentCourses.getSelectedCourses())
          .takeWhile(() => this.isAlive)
          .subscribe(
            (alert: ContentAlert) => {
              if (alert.type === "success") {
                this.alert = alert;
                this.modalData = {
                  type: "response",
                  title: "Student successfully created",
                  text: "You will be redirected to Students list when you click ok.",
                  action: () => this.router.navigate([appRoutePaths.students.path])
                }
              } else {
                this.alert = alert;
                this.modalData.isBusy = false;
                this.confirmModal.close();
              }
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
