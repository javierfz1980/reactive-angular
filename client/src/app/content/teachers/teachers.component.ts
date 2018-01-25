import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Teacher} from "../../models/content/teacher";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {EmailFilter, NameLastnameFilter} from "../../models/filters/generic-string-filter";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import {Student} from "../../models/content/student";
import 'rxjs/add/operator/takeWhile';
import {ContentService} from "../../core/providers/services/content/content.service";
import {Alert} from "../../models/core/alert";

@Component({
  selector: "gl-profesores",
  templateUrl: "./teachers.component.html"
})
export class TeachersComponent implements OnInit, OnDestroy  {

  @ViewChild("confirmModal") confirmModal: ConfirmationModalComponent;

  title: string = "All Teachers";
  teachers: Observable<Teacher[]>;
  isAdministrator: boolean;
  modalData: ConfirmationData;
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();

  private isAlive: boolean = true;

  constructor(private authService: AuthService,
              private contentService: ContentService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();

    this.teachers = this.contentService
      .getTeachers();

    this.contentService.fetchTeachers();
  }

  delete(teacher: Teacher) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Teacher ?",
      action: () => {
        this.modalData.title = "Deleting";
        this.modalData.isBusy = true;
        this.contentService
          .deleteTeacher(teacher)
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

  details(teacher: Teacher) {
    this.router.navigate([appRoutePaths.teachers.path, teacher.id]);
  }

  edit(student: Student) {
    this.router.navigate([appRoutePaths.teachers.path, student.id], { queryParams: { edit: true}});
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
