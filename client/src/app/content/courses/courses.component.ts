import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Course} from "../../models/content/course";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../../core/providers/services/content/content.service";
import {BasicContentDisplay} from "../commons/abstarct-clases/basic-content-display";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-cursos",
  templateUrl: "./courses.component.html"
})
export class CoursesComponent extends BasicContentDisplay<Course> implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  title = "All Courses";
  isAlive: boolean = true;

  createPath: string = appRoutePaths.courses.childs.create.path;
  editPath:string = appRoutePaths.courses.path;

  constructor(protected authService: AuthService,
              protected contentService: ContentService,
              protected router: Router,
              protected route: ActivatedRoute) {
    super(authService, router, route);
  }

  ngOnInit() {
    this.dataSource = this.contentService
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
      super.openDeleteConfirmation(data.title);
  };

  toggleStatus(data: Course) {
    this.action = () => {
      this.modalData.title = "Changing";
      this.modalData.isBusy = true;
      this.contentService
        .updateCourseStatus(data.id, !data.active)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          })
    };
    super.openToggleStatusConfirmation(data.title);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
