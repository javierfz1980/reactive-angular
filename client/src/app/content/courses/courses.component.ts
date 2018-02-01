import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {Course} from "../../models/content/course";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../../core/providers/services/content/content.service";
import {BasicContentDisplay} from "../commons/abstarct-clases/basic-content-display";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-cursos",
  templateUrl: "./courses.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent extends BasicContentDisplay<Course> {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  title = "All Courses";

  contentProvider = this.contentService.getCourses;
  fetchProvider = this.contentService.fetchCourses;
  deleteProvider: (data: Course) => Observable<boolean> = this.contentService.deleteCourse;
  updateStatusProvider: (id: string, data: boolean) => Observable<boolean> = this.contentService.updateCourseStatus;
  createPath: string = appRoutePaths.courses.childs.create.path;
  editPath:string = appRoutePaths.courses.path;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService, authService, route);
  }

}
