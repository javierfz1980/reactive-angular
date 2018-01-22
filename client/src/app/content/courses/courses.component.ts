import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Course} from "../../models/content/course";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {ContentAlert} from "../commons/alert/content-alert.component";
import {CoursesService} from "../../core/providers/services/content/courses.service";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-cursos",
  templateUrl: "./courses.component.html"
})
export class CoursesComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal") confirmModal: ConfirmationModalComponent;

  title = "All Courses";
  courses: Observable<Course[]>;
  isAdministrator: boolean;
  modalData: ConfirmationData;
  alert: ContentAlert;

  private isAlive: boolean = true;

  constructor(private coursesService: CoursesService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();

    this.courses = this.coursesService
      .courses
      .catch(error => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      });

    this.coursesService.fetchData();
  }

  delete(course: Course) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Course ?",
      action: () => {
        this.modalData.isBusy = true;
          this.coursesService
            .deleteData(course)
            .takeWhile(() => this.isAlive)
            .subscribe(
              (alert: ContentAlert) => {
                this.alert = alert;
                this.modalData.isBusy = false;
                setTimeout(() => this.confirmModal.close(), 1)
              })
        }
    };
    this.confirmModal.open();
  }

  toggleStatus(course: Course) {
    this.modalData = {
      type: "confirm",
      title: "Change",
      text: "Are you sure you want to change the Course status ?",
      action: () => {
        this.modalData.isBusy = true;
          this.coursesService
            .changeCourseStatus(course.id, !course.active)
            .takeWhile(() => this.isAlive)
            .subscribe(
              (alert: ContentAlert) => {
                this.alert = alert;
                this.modalData.isBusy = false;
                setTimeout(() => this.confirmModal.close(), 1)
              })
        }
    };
    this.confirmModal.open();
  }

  editCourse(course: Course) {
    this.router.navigate([appRoutePaths.courses.path, course.id], { queryParams: { edit: true}})
  }

  viewCourse(course: Course) {
    this.router.navigate([appRoutePaths.courses.path, course.id])
  }

  create() {
    this.router.navigate([appRoutePaths.courses.childs.create.path], {relativeTo: this.route})
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
