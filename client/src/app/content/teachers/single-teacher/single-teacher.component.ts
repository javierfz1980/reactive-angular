import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CoursesListFormComponent} from "../../commons/forms/lists/courses-list/courses-list-form.component";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Teacher} from "../../../models/content/teacher";
import {InfoProfileData} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';
import {Alert} from "../../../models/core/alert";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Course} from "../../../models/content/course";
import {Student} from "../../../models/content/student";

@Component({
  selector: "gl-single-teacher",
  templateUrl: "./single-teacher.component.html"
})
export class SingleTeacherComponent implements OnInit, OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courses")
  courses: CoursesListFormComponent;

  teacherId: Observable<string>;
  isAdministrator: boolean;
  editMode: boolean = false;
  modalData: ConfirmationData;
  info: Observable<InfoProfileData>;
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

    this.teacherId = this.route.params
      .map((params: Params) => {
        this.contentService.fetchTeachers(params.id);
        return params.id
      });

    this.info = this.contentService
      .getTeachers()
      .withLatestFrom(this.teacherId)
      .map(([teachers, id]) => teachers.find((teacher: Teacher) => teacher.id === id))
      .filter(data => data !== undefined)
      .switchMap((teacher: Teacher) =>{
        return Observable.forkJoin(
          this.contentService.getProfile(teacher.profile_id),
          this.contentService.getAllCoursesOfTeacher(teacher.id),
          Observable.of(teacher))//Observable.of([]))//
      })
      .map(([profile, courses, teacher]) => {
        teacher.courses = courses;
        return ({info: teacher, profile: profile});
      });

    this.allCourses = this.contentService
      .getCourses();

    this.markedCourses = this.info
      .map((data: InfoProfileData) => data.info)
      .map((teacher: Teacher) => teacher.courses);

    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  delete(data: Teacher) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Teacher ?",
      action: () => {
        this.modalData.title = "Deleting";
        this.modalData.isBusy = true;
        this.contentService
          .deleteTeacher(data)
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
              this.router.navigate([appRoutePaths.teachers.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  update(data: InfoProfileData) {
    const coursesToBeRemoved = getDifferencesBetween<string>(data.info.courses, this.courses.getSelecteds());
    const coursesToBeAdded = getDifferencesBetween<string>(this.courses.getSelecteds(), data.info.courses);
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Teacher?",
      action: () => {
        this.modalData.title = "Updating";
        this.modalData.isBusy = true;
        this.contentService
          .updateTeacher(data.info, data.profile, coursesToBeRemoved, coursesToBeAdded)
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
