import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router, Routes} from "@angular/router";
import {Student, StudentInfo} from "../../../models/content/student";
import {Observable} from "rxjs/Observable";
import {
  ContentAlert
} from "../../commons/alert/content-alert.component";
import {AuthService} from "../../../core/providers/services/auth.service";
import {StudentsService} from "../../../core/providers/services/content/students.service";
import 'rxjs/add/observable/throw';
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Subscription} from "rxjs/Subscription";
import {appRoutePaths} from "../../../app-routing.module";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";

@Component({
  selector: "gl-single-student",
  templateUrl: "./single-student.component.html",
  styleUrls: ["./single-student.component.css"]
})
export class SingleStudentComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("studentCourses")
  studentCourses: CoursesFormComponent;

  alert: ContentAlert;
  info: Observable<StudentInfo>;
  isAdministrator: boolean;
  modalData: ConfirmationData;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private studentsService: StudentsService) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
    this.fetchContent();
  }

  fetchContent() {
    this.info = this.route.params
      .map((params: Params) => params.id)
      .switchMap((id:string) => this.studentsService.getStudentInfo(id))
      .catch((error: any) => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      })
      .do((finalData: StudentInfo) => console.log("final data: ", finalData));
  }

  delete(student: Student) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(this.studentsService.deleteStudent(student)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.router.navigate([appRoutePaths.students.path]);
            }));
      }
    };
    this.confirmModal.open();
  }

  update(data: InfoProfileData) {
    const finalData: StudentInfo = {
      info: (<Student>data.info),
      profile: data.profile,
      courses: this.studentCourses.selectedCourses
    };
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(this.studentsService.updateStudentInfo(finalData)
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
