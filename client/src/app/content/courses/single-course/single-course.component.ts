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
import {appRoutePaths} from "../../../app-routing.module";
import {CourseStudentsComponent} from "./course-students/course-students.component";
import {getDifferencesBetween} from "../../../helpers/helpers";
import {ContentService} from "../../../core/providers/services/content/content.service";
import 'rxjs/add/operator/takeWhile';

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
              private contentService: ContentService) {}

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();

    this.courseId = this.route.params
      .map((params: Params) => params.id)
      .do((id: string) => this.contentService.fetchCourses(id));

    this.info = this.contentService
      .getCourses()
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
        this.contentService
          .deleteCourse(course)
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
        this.contentService
          .updateCourse(data, studentsToBeRemoved, studentsToBeAdded)
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
