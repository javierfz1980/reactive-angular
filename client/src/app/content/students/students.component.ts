import {Component, OnInit, ViewChild} from "@angular/core";
import {Student} from "../../models/content/student";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {appRoutePaths} from "../../app-routing.module";
import {EmailFilter, NameLastnameFilter} from "../../models/filters/generic-string-filter";
import {ContentService} from "../../core/providers/services/content/content.service";
import {BasicContentDisplay} from "../commons/abstarct-clases/basic-content-display";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-alumnos",
  templateUrl: "./students.component.html"
})
export class StudentsComponent extends BasicContentDisplay<Student> {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  title: string = "All Students";
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();

  contentProvider = this.contentService.getStudents;
  fetchProvider = this.contentService.fetchStudents;
  deleteProvider = this.contentService.deleteStudent;
  createPath = appRoutePaths.students.childs.create.path;
  editPath = appRoutePaths.students.path;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService, authService, route);
  }

}
