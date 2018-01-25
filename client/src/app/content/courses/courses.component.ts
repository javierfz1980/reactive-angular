import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Course} from "../../models/content/course";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import 'rxjs/add/operator/takeWhile';
import {ContentService} from "../../core/providers/services/content/content.service";
import {Alert} from "../../models/core/alert";

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

  private isAlive: boolean = true;

  constructor(private contentService: ContentService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();

    this.courses = this.contentService
      .getCourses();

    this.contentService.fetchCourses();
  }

  delete(course: Course) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Course ?",
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
        this.modalData.title = "Changing";
        this.modalData.isBusy = true;
          this.contentService
            .updateCourseStatus(course.id, !course.active)
            .takeWhile(() => this.isAlive)
            .subscribe(
              () => {
                this.modalData.isBusy = false;
                this.confirmModal.close();
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
