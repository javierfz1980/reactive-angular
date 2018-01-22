import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Student} from "../../../models/content/student";
import {Profile} from "../../../models/content/profile";
import {Observable} from "rxjs/Observable";
import {
  ContentAlert
} from "../../commons/alert/content-alert.component";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  StudentsService
} from "../../../core/providers/services/content/students.service";
import 'rxjs/add/observable/throw';
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../../app-routing.module";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';

@Component({
  selector: "gl-single-student",
  templateUrl: "./single-student.component.html"
})
export class SingleStudentComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("studentCourses")
  studentCourses: CoursesFormComponent;

  alert: ContentAlert;
  info: Observable<InfoProfileData>;
  studentId: Observable<string>;

  isAdministrator: boolean;
  editMode: boolean = false;
  modalData: ConfirmationData;

  private isAlive: boolean = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private studentsService: StudentsService) {}

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();

    this.studentId = this.route.params
      .map((params: Params) => params.id)
      .do((id: string) => this.studentsService.fetchData(id));

    this.info = this.studentsService
      .students
      .withLatestFrom(this.studentId)
      .map(([students, id]) => students.find((student: Student) => student.id === id))
      .filter(data => data !== undefined)
      .switchMap((student: Student) => {
        return this.studentsService.getProfile(student.profile_id)
          .map((profile: Profile) => ({info: student, profile: profile}))
      })
  }

  delete(student: Student) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.studentsService
          .deleteData(student)
          .takeWhile(() => this.isAlive)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.router.navigate([appRoutePaths.students.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  update(data: InfoProfileData) {
    const coursesToBeRemoved = getDifferencesBetween<string>((<Student>data.info).courses, this.studentCourses.getSelectedCourses());
    const coursesToBeAdded = getDifferencesBetween<string>(this.studentCourses.getSelectedCourses(), (<Student>data.info).courses);
    (<Student>data.info).courses = this.studentCourses.getSelectedCourses();
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Student ?",
      action: () => {
        this.modalData.isBusy = true;
        this.studentsService
          .updateData(data.info, data.profile, coursesToBeRemoved, coursesToBeAdded)
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

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
