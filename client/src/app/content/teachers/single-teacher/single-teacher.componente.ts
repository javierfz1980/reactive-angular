import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Teacher} from "../../../models/content/teacher";
import {TeachersService} from "../../../core/providers/services/content/teachers.service";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-single-teacher",
  templateUrl: "./single-teacher.componente.html"
})
export class SingleTeacherComponente implements OnInit, OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courses")
  courses: CoursesFormComponent;

  alert: ContentAlert;
  info: Observable<InfoProfileData>;
  isAdministrator: boolean;
  editMode: boolean = false;
  modalData: ConfirmationData;

  private isAlive: boolean = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private teachersService: TeachersService) {}

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();
    this.fetchContent();
  }

  fetchContent() {
    this.info = this.route.params
      .map((params: Params) => params.id)
      .switchMap((id:string) => this.teachersService.getTeacherInfo(id))
      .do(data => console.log("ACACACA: ", data))
      .catch((error: any) => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      })
  }

  delete(data: Teacher) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Teacher ?",
      action: () => {
        this.modalData.isBusy = true;
        this.teachersService
          .deleteTeacher(data)
          .takeWhile(() => this.isAlive)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.router.navigate([appRoutePaths.teachers.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  update(data: InfoProfileData) {
    const coursesToBeRemoved = getDifferencesBetween<string>((<Teacher>data.info).courses, this.courses.getSelectedCourses());
    const coursesToBeAdded = getDifferencesBetween<string>(this.courses.getSelectedCourses(), (<Teacher>data.info).courses);
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Teacher?",
      action: () => {
        this.modalData.isBusy = true;
        this.teachersService
          .updateTeacherInfo(data.info, data.profile, coursesToBeRemoved, coursesToBeAdded)
          .takeWhile(() => this.isAlive)
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

  toggleEditMode() {
    this.editMode = !this.editMode;
    console.log(this.isAdministrator && this.editMode);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
