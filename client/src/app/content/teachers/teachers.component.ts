import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
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
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-profesores",
  templateUrl: "./teachers.component.html"
})
export class TeachersComponent extends BasicContentDisplay<Teacher> implements OnInit, OnDestroy  {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  title: string = "All Teachers";
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();
  isAlive: boolean = true;

  createPath: string = appRoutePaths.teachers.childs.create.path;
  editPath:string = appRoutePaths.teachers.path;

  constructor(protected authService: AuthService,
              protected contentService: ContentService,
              protected router: Router,
              protected route: ActivatedRoute) {
    super(authService, router, route);
  }

  ngOnInit() {
    this.dataSource = this.contentService
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
    };
    super.openDeleteConfirmation();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
