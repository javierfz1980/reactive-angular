import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Teacher} from "../../models/content/teacher";
import {
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {EmailFilter, NameLastnameFilter} from "../../models/filters/generic-string-filter";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../../core/providers/services/content/content.service";
import {BasicContentDisplay} from "../commons/abstarct-clases/basic-content-display";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-profesores",
  templateUrl: "./teachers.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeachersComponent extends BasicContentDisplay<Teacher> {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  title: string = "All Teachers";
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();

  contentProvider = this.contentService.getTeachers;
  fetchProvider = this.contentService.fetchTeachers;
  deleteProvider: (data: Teacher) => Observable<boolean> = this.contentService.deleteTeacher;
  createPath: string = appRoutePaths.teachers.childs.create.path;
  editPath:string = appRoutePaths.teachers.path;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService, authService, route);
  }

}
