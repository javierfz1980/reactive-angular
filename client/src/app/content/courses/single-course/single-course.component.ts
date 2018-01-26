import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Course} from "../../../models/content/course";
import {appRoutePaths} from "../../../app-routing.module";
import {StudentsListForm} from "../../commons/forms/lists/students-list/students-list-form";
import {getDifferencesBetween} from "../../../helpers/helpers";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Student} from "../../../models/content/student";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-single-course",
  templateUrl: "./single-course.component.html"
})
export class SingleCourseComponent implements OnInit, OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courseStudents")
  students: StudentsListForm;

  isAdministrator: boolean;
  editMode: boolean = false;
  modalData: ConfirmationData;

  info: Observable<Course>;
  courseId: Observable<string>;
  allStudents: Observable<Student[]>;
  markedStudents: Observable<string[]>;
  isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private isAlive: boolean = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private contentService: ContentService) {
  }

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();

    this.courseId = this.route.params
      .map((params: Params) => {
        this.contentService.fetchCourses(params.id);
        return params.id;
      });

    this.info = this.contentService
      .getCourses()
      .filter(data => data !== undefined)
      .withLatestFrom(this.courseId)
      .map(([courses, id]) => courses.find((courseData: Course) => courseData.id === id));

    this.allStudents = this.contentService
      .getStudents();

    this.markedStudents = this.info
      .map((course: Course) => course.students);

    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  delete(course: Course) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Course ?",
      action: () => {
        this.modalData.title = "Deleting";
        this.modalData.isBusy = true;
        this.contentService
          .deleteCourse(course)
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
              this.router.navigate([appRoutePaths.courses.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  update(data: Course) {
    const studentsToBeRemoved = getDifferencesBetween<string>(data.students ? data.students : [], this.students.getSelecteds());
    const studentsToBeAdded = getDifferencesBetween<string>(this.students.getSelecteds(), data.students ? data.students : []);
    data.students = this.students.getSelecteds();
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Course ?",
      action: () => {
        this.modalData.title = "Updating";
        this.modalData.isBusy = true;
        this.contentService
          .updateCourse(data, studentsToBeRemoved, studentsToBeAdded)
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
            });
      }
    };
    this.confirmModal.open();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
