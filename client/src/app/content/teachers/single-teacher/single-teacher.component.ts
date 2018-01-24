import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CoursesFormComponent} from "../../commons/courses-form/courses-form.component";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Teacher} from "../../../models/content/teacher";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';
import {Alert} from "../../../models/core/alert";

@Component({
  selector: "gl-single-teacher",
  templateUrl: "./single-teacher.component.html"
})
export class SingleTeacherComponent implements OnInit, OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courses")
  courses: CoursesFormComponent;

  info: Observable<InfoProfileData>;
  teacherId: Observable<string>;
  isAdministrator: boolean;
  editMode: boolean = false;
  modalData: ConfirmationData;

  private isAlive: boolean = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private contentService: ContentService) {}

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();

    this.teacherId = this.route.params
      .map((params: Params) => params.id)
      .do((id: string) => this.contentService.fetchTeachers(id));

    this.info = this.contentService
      .getTeachers()
      .withLatestFrom(this.teacherId)
      .map(([teachers, id]) => teachers.find((teacher: Teacher) => teacher.id === id))
      .filter(data => data !== undefined)
      .switchMap((teacher: Teacher) =>{
        return Observable.forkJoin(
          this.contentService.getProfile(teacher.profile_id),
          this.contentService.getAllCoursesOfTeacher(teacher.id))
          .map(([profile, courses]) => {
            teacher.courses = courses;
            return ({info: teacher, profile: profile});
          })
      })
  }

  delete(data: Teacher) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Teacher ?",
      action: () => {
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
    const coursesToBeRemoved = getDifferencesBetween<string>(data.info.courses, this.courses.getSelectedCourses());
    const coursesToBeAdded = getDifferencesBetween<string>(this.courses.getSelectedCourses(), data.info.courses);
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Teacher?",
      action: () => {
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
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
