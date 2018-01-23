import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {appRoutePaths} from "../../../app-routing.module";
import {Course} from "../../../models/content/course";
import {CourseStudentsComponent} from "../single-course/course-students/course-students.component";
import {Router} from "@angular/router";
import {ContentService} from "../../../core/providers/services/content/content.service";

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
  alert: ContentAlert;

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
            (alert: ContentAlert) => {
              if (alert.type === "success") {
                this.alert = alert;
                this.modalData = {
                  type: "response",
                  title: "Course successfully created",
                  text: "You will be redirected to Courses list when you click ok.",
                  action: () => {
                    this.router.navigate([appRoutePaths.courses.path])
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
