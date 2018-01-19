import {Component, OnDestroy, ViewChild} from "@angular/core";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Router} from "@angular/router";
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

  private isAlive: boolean = true;

  constructor(private teachersService: TeachersService,
              private router: Router) {}

  create(data: InfoProfileData) {
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this new Teacher ?",
      action: () => {
        this.modalData.isBusy = true;
        this.teachersService
          .createTeacher(data.info, data.profile, this.teacherCourses.getSelectedCourses())
          .takeWhile(() => this.isAlive)
          .subscribe(
            (alert: ContentAlert) => {
              if (alert.type === "success") {
                this.alert = alert;
                this.modalData = {
                  type: "response",
                  title: "Teacher successfully created",
                  text: "You will be redirected to Teachers list when you click ok.",
                  action: () => {
                    this.router.navigate([appRoutePaths.teachers.path])
                  }
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
