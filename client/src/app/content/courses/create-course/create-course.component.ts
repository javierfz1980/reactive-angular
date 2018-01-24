import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../../app-routing.module";
import {Course} from "../../../models/content/course";
import {CourseStudentsComponent} from "../single-course/course-students/course-students.component";
import {Router} from "@angular/router";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Alert} from "../../../models/core/alert";

@Component({
  selector: "gl-create-course",
  templateUrl: "./create-course.component.html"
})
export class CreateCourseComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courseStudents")
  students: CourseStudentsComponent;

  title: string = "Create new Course";
  isAdministrator: boolean;
  modalData: ConfirmationData;

  private isAlive: boolean = true;

  constructor(private authService: AuthService,
              private contentService: ContentService,
              private router: Router) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
  }

  create(data: Course) {
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this new Course?",
      action: () => {
        this.modalData.isBusy = true;
        this.contentService
          .createCourse(data, this.students.getSelectedStudents())
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
              this.router.navigate([appRoutePaths.courses.path])
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
