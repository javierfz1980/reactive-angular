import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../models/content/student";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationModalData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {appRoutePaths} from "../../app-routing.module";
import {EmailFilter, NameLastnameFilter} from "../../models/filters/generic-string-filter";
import 'rxjs/add/operator/takeWhile';
import {ContentService} from "../../core/providers/services/content/content.service";
import {Alert} from "../../models/core/alert";
import {BasicContentDisplayNavigator} from "../commons/abstarct-clases/basic-content-display";

@Component({
  selector: "gl-alumnos",
  templateUrl: "./students.component.html"
})
export class StudentsComponent extends BasicContentDisplayNavigator<Student> implements OnInit, OnDestroy {

  title: string = "All Students";
  students: Observable<Student[]>;
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();
  isAlive: boolean = true;

  constructor(protected contentService: ContentService,
              protected authService: AuthService,
              protected router: Router,
              protected route: ActivatedRoute) {
    super(authService, router, route);
  }

  ngOnInit() {
    console.log("aca: ", this);
    this.createPath = appRoutePaths.students.childs.create.path;
    this.editPath = appRoutePaths.students.path;

    this.students = this.contentService
      .getStudents()
      .filter(students => students !== undefined);

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
