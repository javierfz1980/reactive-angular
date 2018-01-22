import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Course} from "../../../models/content/course";
import {CoursesService} from "../../../core/providers/services/content/courses.service";
import {appRoutePaths} from "../../../app-routing.module";
import {CourseStudentsComponent} from "./course-students/course-students.component";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';
import {Profile} from "../../../models/content/profile";
import {Student} from "../../../models/content/student";

@Component({
  selector: "gl-single-course",
  templateUrl: "./single-course.component.html"
})
export class SingleCourseComponent implements OnInit, OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courseStudents")
  students: CourseStudentsComponent;

  alert: ContentAlert;
  info: Observable<any>;
  courseId: Observable<string>;
  isAdministrator: boolean;
  editMode: boolean = false;
  modalData: ConfirmationData;

  private isAlive: boolean = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private coursesService: CoursesService) {}

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();

    this.courseId = this.route.params
      .map((params: Params) => params.id)
      .do((id: string) => this.coursesService.fetchData(id));

    this.info = this.coursesService
      .courses
      .withLatestFrom(this.courseId)
      .map(([courses, id]) => courses.find((courseData: Course) => courseData.id === id))
      .filter(data => data !== undefined)
  }

  delete(course: Course) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Course ?",
      action: () => {
        this.modalData.isBusy = true;
        this.coursesService
          .deleteData(course)
          .takeWhile(() => this.isAlive)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.router.navigate([appRoutePaths.courses.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  update(data: Course) {
    const studentsToBeRemoved = getDifferencesBetween<string>(data.students ? data.students : [], this.students.getSelectedStudents());
    const studentsToBeAdded = getDifferencesBetween<string>(this.students.getSelectedStudents(), data.students ? data.students : []);
    data.students = this.students.getSelectedStudents();
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Course ?",
      action: () => {
        this.modalData.isBusy = true;
        this.coursesService
          .updateData(data, studentsToBeRemoved, studentsToBeAdded)
          .takeWhile(() => this.isAlive)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              setTimeout(() => this.confirmModal.close(), 1)
            });
      }
    };
    this.confirmModal.open();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
