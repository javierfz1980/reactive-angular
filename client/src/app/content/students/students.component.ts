import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
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
export class StudentsComponent extends BasicContentDisplay<Student> implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  title: string = "All Students";
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();
  isAlive: boolean = true;

  createPath: string = appRoutePaths.students.childs.create.path;
  editPath:string = appRoutePaths.students.path;

  constructor(protected contentService: ContentService,
              protected authService: AuthService,
              protected router: Router,
              protected route: ActivatedRoute) {
    super(authService, router, route);
  }

  ngOnInit() {
    this.dataSource = this.contentService
      .getStudents();

    this.contentService.fetchStudents();
  }

  delete(data: Student) {
    this.action = () => {
      this.modalData.title = "Deleting";
      this.modalData.isBusy = true;
      this.contentService
        .deleteStudent(data)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    };
    this.openDeleteConfirmation();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
