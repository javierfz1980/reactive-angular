import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../models/content/student";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {ContentAlert} from "../commons/alert/content-alert.component";
import {ActivatedRoute, Router} from "@angular/router";
import {appRoutePaths} from "../../app-routing.module";
import {
  StudentsService
} from "../../core/providers/services/content/students.service";
import {EmailFilter, NameLastnameFilter} from "../../models/filters/generic-string-filter";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-alumnos",
  templateUrl: "./students.component.html"
})
export class StudentsComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal") confirmModal: ConfirmationModalComponent;

  title: string = "All Students";
  students: Observable<Student[]>;
  isAdministrator: boolean;
  modalData: ConfirmationData;
  alert: ContentAlert;
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();

  private isAlive: boolean = true;

  constructor(private studentsService: StudentsService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
    this.students = this.studentsService
      .students
      .catch(error => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      });

    this.studentsService.fetchData();
  }

  delete(student: Student) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.studentsService
          .deleteData(student)
          .takeWhile(() => this.isAlive)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              setTimeout(() => this.confirmModal.close(), 1);
            });
      }
    };
    this.confirmModal.open();
  }

  create() {
    this.router.navigate([appRoutePaths.students.childs.create.path], {relativeTo: this.route})
  }

  edit(student: Student) {
    this.router.navigate([appRoutePaths.students.path, student.id], { queryParams: { edit: true}});
  }

  details(student: Student) {
    this.router.navigate([appRoutePaths.students.path, student.id]);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
