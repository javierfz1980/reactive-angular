import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Teacher, TeacherInfo} from "../../../models/content/teacher";
import {TeachersService} from "../../../core/providers/services/content/teachers.service";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {appRoutePaths} from "../../../app-routing.module";

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
  info: Observable<TeacherInfo>;
  isAdministrator: boolean;
  modalData: ConfirmationData;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private teachersService: TeachersService) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
    this.fetchContent();
  }

  fetchContent() {
    this.info = this.route.params
      .map((params: Params) => params.id)
      .switchMap((id:string) => this.teachersService.getTeacherInfo(id))
      .catch((error: any) => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      })
      .do((finalData: TeacherInfo) => console.log("final data: ", finalData));
  }

  delete(data: Teacher) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Teacher ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(this.teachersService.deleteTeacher(data)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.router.navigate([appRoutePaths.teachers.path]);
            }));
      }
    };
    this.confirmModal.open();
  }

  update(data: InfoProfileData) {
    const finalData: TeacherInfo = {
      info: (<Teacher>data.info),
      profile: data.profile,
      courses: this.courses.selectedCourses
    };
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Teacher?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(this.teachersService.updateTeacherInfo(finalData)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.fetchContent();
            }));
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0)
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
