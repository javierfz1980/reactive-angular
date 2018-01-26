import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Teacher} from "../../models/content/teacher";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationModalData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {EmailFilter, NameLastnameFilter} from "../../models/filters/generic-string-filter";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import {Student} from "../../models/content/student";
import 'rxjs/add/operator/takeWhile';
import {ContentService} from "../../core/providers/services/content/content.service";
import {Alert} from "../../models/core/alert";
import {BasicContentDisplayNavigator} from "../commons/abstarct-clases/basic-content-display";

@Component({
  selector: "gl-profesores",
  templateUrl: "./teachers.component.html"
})
export class TeachersComponent extends BasicContentDisplayNavigator<Teacher> implements OnInit, OnDestroy  {

  title: string = "All Teachers";
  teachers: Observable<Teacher[]>;
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();
  isAlive: boolean = true;

  constructor(protected authService: AuthService,
              protected contentService: ContentService,
              protected router: Router,
              protected route: ActivatedRoute) {
    super(authService, router, route);
  }

  ngOnInit() {
    this.createPath = appRoutePaths.teachers.childs.create.path;
    this.editPath = appRoutePaths.teachers.path;

    this.teachers = this.contentService
      .getTeachers();

    this.contentService.fetchTeachers();
  }

  delete(data: Teacher) {
    this.action = () => {
      this.modalData.title = "Deleting";
      this.modalData.isBusy = true;
      this.contentService
        .deleteTeacher(data)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    }
    super.openDeleteConfirmation();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
