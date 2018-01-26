import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Student} from "../../../models/content/student";
import {Profile} from "../../../models/content/profile";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import 'rxjs/add/observable/throw';
import {InfoProfileData} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../../app-routing.module";
import {CoursesListFormComponent} from "../../commons/forms/lists/courses-list/courses-list-form.component";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import {Alert} from "../../../models/core/alert";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Course} from "../../../models/content/course";

@Component({
  selector: "gl-single-student",
  templateUrl: "./single-student.component.html"
})
export class SingleStudentComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("studentCourses")
  studentCourses: CoursesListFormComponent;

  isAdministrator: boolean;
  editMode: boolean = false;
  modalData: ConfirmationData;
  info: Observable<InfoProfileData>;
  studentId: Observable<string>;
  allCourses: Observable<Course[]>;
  markedCourses: Observable<string[]>;
  isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private isAlive: boolean = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private contentService: ContentService) {}

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();

    this.studentId = this.route.params
      .map((params: Params) => {
        this.contentService.fetchStudents(params.id);
        return params.id;
      });

    this.info = this.contentService
      .getStudents()
      .withLatestFrom(this.studentId)
      .map(([students, id]) => students.find((student: Student) => student.id === id))
      .filter(data => data !== undefined)
      .switchMap((student: Student) => {
        return this.contentService.getProfile(student.profile_id)
          .map((profile: Profile) => ({info: student, profile: profile}))
      });

    this.allCourses = this.contentService
      .getCourses();

    this.markedCourses = this.info
      .map((data: InfoProfileData) => data.info)
      .map((student: Student) => student.courses);

    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  delete(student: Student) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Student ?",
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
              this.router.navigate([appRoutePaths.students.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  update(data: InfoProfileData) {
    const coursesToBeRemoved = getDifferencesBetween<string>(data.info.courses, this.studentCourses.getSelecteds());
    const coursesToBeAdded = getDifferencesBetween<string>(this.studentCourses.getSelecteds(), data.info.courses);
    data.info.courses = this.studentCourses.getSelecteds();
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Student ?",
      action: () => {
        this.modalData.title = "Updating";
        this.modalData.isBusy = true;
        this.contentService
          .updateStudent(data.info, data.profile, coursesToBeRemoved, coursesToBeAdded)
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

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
