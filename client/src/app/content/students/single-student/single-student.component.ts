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
  ConfirmationModalData,
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../../app-routing.module";
import {CoursesListFormComponent} from "../../commons/forms/lists/courses-list/courses-list-form.component";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import {Alert} from "../../../models/core/alert";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Course} from "../../../models/content/course";
import {BasicSingleEditorWithList} from "../../commons/abstarct-clases/basic-single-editor-with-list";
import {StudentsListFormComponent} from "../../commons/forms/lists/students-list/students-list-form.component";

@Component({
  selector: "gl-single-student",
  templateUrl: "./single-student.component.html"
})
export class SingleStudentComponent extends BasicSingleEditorWithList<InfoProfileData, CoursesListFormComponent, Course>  implements OnInit {

  constructor(private router: Router,
              private contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(authService, route);
  }

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();

    this.id = this.route.params
      .map((params: Params) => {
        this.contentService.fetchStudents(params.id);
        return params.id;
      });

    this.source = this.contentService
      .getStudents()
      .withLatestFrom(this.id)
      .map(([students, id]) => students.find((student: Student) => student.id === id))
      .filter(data => data !== undefined)
      .switchMap((student: Student) => {
        return this.contentService.getProfile(student.profile_id)
          .map((profile: Profile) => ({info: student, profile: profile}))
      });

    this.listFormSource = this.contentService
      .getCourses();

    this.listFormMarkeds = this.source
      .map((data: InfoProfileData) => data.info)
      .map((student: Student) => student.courses);

    this.isEditMode.next((this.isAdministrator && this.editMode));
  }

  delete(data: Student) {
    this.action = () => {
      this.modalData.title = "Deleting";
      this.modalData.isBusy = true;
      this.contentService
        .deleteStudent(data)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
            this.router.navigate([appRoutePaths.students.path]);
          });
    };
    super.openDeleteModal();
  }

  update(data: InfoProfileData) {
    const originalCourses: string[] = data.info.courses;
    data.info.courses = this.listForm.getSelecteds();
    this.action = () => {
      this.modalData.title = "Updating";
      this.modalData.isBusy = true;
      this.contentService
        .updateStudent(data.info, data.profile, this.elementsTobeRemoved, this.elementsTobeAdded)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    }
    super.openUpdateModal(originalCourses, this.listForm.getSelecteds())
  }

  toggleEditMode() {
    super.toggleEditMode();
  }

}
