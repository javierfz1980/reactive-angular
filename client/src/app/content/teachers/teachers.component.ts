import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Teacher} from "../../models/content/teacher";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {ContentAlert} from "../commons/alert/content-alert.component";
import {Subscription} from "rxjs/Subscription";
import {TeachersService} from "../../core/providers/services/content/teachers.service";
import {EmailFilter, NameLastnameFilter} from "../../models/filters/generic-string-filter";
import {appRoutePaths} from "../../app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";

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
  alert: ContentAlert;
  nameLastnameFilter = new NameLastnameFilter();
  emailFilter = new EmailFilter();

  private subscription: Subscription;

  constructor(private authService: AuthService,
              private teachersService: TeachersService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.fetchContent();
    this.isAdministrator = this.authService.isAdministrator();
  }

  fetchContent() {
    this.teachers = this.teachersService
      .getTeachers()
      .catch(error => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      });
  }

  details(teacher: Teacher) {
    this.router.navigate([appRoutePaths.teachers.path, teacher.id]);
  }

  delete(teacher: Teacher) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Teacher ?",
      action: () => {
        this.modalData.isBusy = true;
        this.teachersService.deleteTeacher(teacher)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.fetchContent();
            });
      }
    };
    this.confirmModal.open();
  }

  create() {
    this.router.navigate([appRoutePaths.students.childs.create.path], {relativeTo: this.route})
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
