import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CoursesListFormComponent} from "../../commons/forms/lists/courses-list/courses-list-form.component";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationModalData,
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
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
import {BasicSingleEditorWithList} from "../../commons/abstarct-clases/basic-single-editor-with-list";
import {StudentsListFormComponent} from "../../commons/forms/lists/students-list/students-list-form.component";

@Component({
  selector: "gl-single-teacher",
  templateUrl: "./single-teacher.component.html"
})
export class SingleTeacherComponent extends BasicSingleEditorWithList<InfoProfileData, CoursesListFormComponent, Course> implements OnInit {

  constructor(private router: Router,
              private contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(authService, route);
  }

  ngOnInit() {
    super.ngOnInit();

    this.id = this.route.params
      .map((params: Params) => {
        this.contentService.fetchTeachers(params.id);
        return params.id
      });

    this.source = this.contentService
      .getTeachers()
      .withLatestFrom(this.id)
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
      });

    this.listFormSource = this.contentService
      .getCourses();

    this.listFormMarked = this.source
      .map((data: InfoProfileData) => data.info)
      .map((teacher: Teacher) => teacher.courses);
  }

  delete(data: Teacher) {
    this.action = () => {
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
    };
    super.openDeleteModal();
  }

  update(data: InfoProfileData) {
    this.action = () => {
      this.modalData.title = "Updating";
      this.modalData.isBusy = true;
      this.contentService
        .updateTeacher(data.info, data.profile, this.elementsTobeRemoved, this.elementsTobeAdded)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    }
    super.openUpdateModal(data.info.courses, this.listForm.getSelecteds())
  }

  toggleEditMode() {
    super.toggleEditMode();
  }

}
