import {Component, OnDestroy, ViewChild} from "@angular/core";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";
import {Student, StudentInfo} from "../../../models/content/student";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {TeachersService} from "../../../core/providers/services/content/teachers.service";

@Component({
  selector: "gl-create-teacher",
  templateUrl: "create-teacher.component.html"
})
export class CreateTeacherComponent implements OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("teacherCourses")
  teacherCourses: CoursesFormComponent;

  title: string = "Add new Teacher";
  modalData: ConfirmationData;
  alert: ContentAlert;

  private subscription: Subscription;

  constructor(private teachersService: TeachersService,
              private router: Router) {}

  create(data: InfoProfileData) {
    const finalData: StudentInfo = {
      info: (<Student>data.info),
      profile: data.profile,
      courses: this.teacherCourses.selectedCourses
    };
    console.log("create: ", finalData);
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this new Teacher ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscription = this.teachersService.createTeacher(finalData)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              if (alert.type === "success") this.router.navigate([appRoutePaths.teachers.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
