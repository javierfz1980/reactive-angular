import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/filter";
import {Course} from "../../models/content/course";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {Subscription} from "rxjs/Subscription";
import {ContentAlert} from "../commons/alert/content-alert.component";
import {CoursesService} from "../../core/providers/services/content/courses.service";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";

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

  private subscriptions: Subscription[] = [];

  constructor(private coursesService: CoursesService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.fetchContent();
    this.isAdministrator = this.authService.isAdministrator();
  }

  private fetchContent() {
    this.courses = this.coursesService
      .getCourses()
      .catch(error => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      });
  }

  delete(course: Course) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Course ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(
          this.coursesService.deleteCourse(course)
            .subscribe(
              (alert: ContentAlert) => {
                this.alert = alert;
                this.modalData.isBusy = false;
                this.fetchContent();
              })
        )}
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
        this.subscriptions.push(
          this.coursesService.updateCourse(course.id, {active: !course.active})
            .subscribe(
              (alert: ContentAlert) => {
                this.alert = alert;
                this.modalData.isBusy = false;
                this.fetchContent();
              })
        )}
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
    if (this.subscriptions.length > 0)
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
