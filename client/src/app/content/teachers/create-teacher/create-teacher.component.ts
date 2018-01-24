import {Component, OnDestroy, ViewChild} from "@angular/core";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Router} from "@angular/router";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Alert} from "../../../models/core/alert";

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

  private isAlive: boolean = true;

  constructor(private contentService: ContentService,
              private router: Router) {}

  create(data: InfoProfileData) {
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this new Teacher ?",
      action: () => {
        this.modalData.isBusy = true;
        this.contentService
          .createTeacher(data.info, data.profile, this.teacherCourses.getSelectedCourses())
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
              this.router.navigate([appRoutePaths.teachers.path])
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
