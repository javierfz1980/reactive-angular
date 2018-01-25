import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../models/content/student";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {appRoutePaths} from "../../app-routing.module";
import {EmailFilter, NameLastnameFilter} from "../../models/filters/generic-string-filter";
import 'rxjs/add/operator/takeWhile';
import {ContentService} from "../../core/providers/services/content/content.service";
import {Alert} from "../../models/core/alert";

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
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();

  private isAlive: boolean = true;

  constructor(private contentService: ContentService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
    this.students = this.contentService
      .getStudents()
      .filter(students => students !== undefined);

    this.contentService.fetchStudents();
  }

  delete(student: Student) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Student ?",
      action: () => {
        this.modalData.title = "Deleting";
        this.modalData.isBusy = true;
        this.contentService
          .deleteStudent(student)
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
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
