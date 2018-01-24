import {Component, OnDestroy, ViewChild} from "@angular/core";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Alert} from "../../../models/core/alert";

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

  private isAlive: boolean = true;

  constructor(private contentService: ContentService,
              private router: Router) {}

  create(data: InfoProfileData) {
    data.info.courses = this.studentCourses.getSelectedCourses();
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to createData this new Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.contentService
          .createStudent(data.info, data.profile, this.studentCourses.getSelectedCourses())
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
              this.router.navigate([appRoutePaths.students.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
