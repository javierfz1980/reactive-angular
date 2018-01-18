import {Component, OnDestroy, ViewChild} from "@angular/core";
import {Student} from "../../../models/content/student";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Subscription} from "rxjs/Subscription";
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

  private subscription: Subscription;

  constructor(private studentsService: StudentsService,
              private router: Router) {}

  create(data: InfoProfileData) {
    (<Student>data.info).courses = this.studentCourses.getSelectedCourses();
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this new Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscription = this.studentsService.createStudent(data.info, data.profile, this.studentCourses.getSelectedCourses())
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              if (alert.type === "success") this.router.navigate([appRoutePaths.students.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
