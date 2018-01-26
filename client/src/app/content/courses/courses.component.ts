import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Course} from "../../models/content/course";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationModalData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import 'rxjs/add/operator/takeWhile';
import {ContentService} from "../../core/providers/services/content/content.service";
import {Alert} from "../../models/core/alert";
import {Teacher} from "../../models/content/teacher";
import {BasicContentDisplayNavigator} from "../commons/abstarct-clases/basic-content-display";

@Component({
  selector: "gl-cursos",
  templateUrl: "./courses.component.html"
})
export class CoursesComponent extends BasicContentDisplayNavigator<Course> implements OnInit, OnDestroy {

  title = "All Courses";
  courses: Observable<Course[]>;
  isAlive: boolean = true;

  constructor(protected authService: AuthService,
              protected contentService: ContentService,
              protected router: Router,
              protected route: ActivatedRoute) {
    super(authService, router, route);
  }

  ngOnInit() {
    this.createPath = appRoutePaths.courses.childs.create.path;
    this.editPath = appRoutePaths.courses.path;

    this.courses = this.contentService
      .getCourses();

    this.contentService.fetchCourses();
  }

  delete(data: Course) {
    this.action = () => {
      this.modalData.title = "Deleting";
      this.modalData.isBusy = true;
      this.contentService
        .deleteCourse(data)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          })
      };
      super.openDeleteConfirmation();
  };

  toggleStatus(course: Course) {
    this.action = () => {
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
    super.openToggleStatusConfirmation();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
