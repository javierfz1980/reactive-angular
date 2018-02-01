import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Student} from "../../../models/content/student";
import {Profile} from "../../../models/content/profile";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ProfileInfoComponent
} from "../../commons/info/profile-info/profile-info.component";
import {Course} from "../../../models/content/course";
import {ConfirmationModalComponent} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {StoreData} from "../../../models/core/store-data";
import {Observable} from "rxjs/Observable";
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import {appRoutePaths} from "../../../app-routes";

@Component({
  selector: "gl-view-student",
  templateUrl: "./view-student.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewStudentComponent extends BasicContentEditor<Student> implements OnInit {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: ProfileInfoComponent;

  contentProvider = this.contentService.getStudents;
  fetchProvider = this.contentService.fetchStudents;
  deleteProvider = this.contentService.deleteStudent;
  updateProvider = this.contentService.updateStudent;

  listFormSource: Observable<StoreData<Course>>;
  listFormMarked: Observable<string[]>;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService, authService, route);
  }

  ngOnInit() {
    super.ngOnInit();

    this.dataSource = this.dataSource
      .switchMap((student: Student) => {
        return this.contentService.getProfile(student.profile_id)
          .map((profile: Profile) => {
            student.profile = profile;
            return student;
          })
      });

    this.listFormSource = this.contentService
      .getActiveCoursesWithTeacher();

    this.listFormMarked = this.dataSource
      .map((student: Student) => student.courses);
  }

  delete(data: Student) {
    super.delete(data, appRoutePaths.students.path);
  }

  update(data: Student) {
    const elementsTobeRemoved = getDifferencesBetween<string>
      (data.courses, this.infoForm.listForm ? this.infoForm.listForm.getSelecteds() : []);
    const elementsTobeAdded = getDifferencesBetween<string>
      (this.infoForm.listForm ? this.infoForm.listForm.getSelecteds() : [], data.courses);
    data.courses = this.infoForm.listForm.getSelecteds();
    data.profile = data.profile;
    super.update(data, elementsTobeRemoved, elementsTobeAdded);
  }

}
