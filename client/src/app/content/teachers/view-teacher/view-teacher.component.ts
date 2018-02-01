import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {Teacher} from "../../../models/content/teacher";
import {
  ProfileInfoComponent
} from "../../commons/info/profile-info/profile-info.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Course} from "../../../models/content/course";
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";
import {StoreData} from "../../../models/core/store-data";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-view-teacher",
  templateUrl: "./view-teacher.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTeacherComponent extends BasicContentEditor<Teacher> implements OnInit {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: ProfileInfoComponent;

  contentProvider = this.contentService.getTeachers;
  fetchProvider = this.contentService.fetchTeachers;
  deleteProvider = this.contentService.deleteTeacher;
  updateProvider = this.contentService.updateTeacher;

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
      .switchMap((teacher: Teacher) =>{
        return Observable.forkJoin(
          this.contentService.getProfile(teacher.profile_id),
          this.contentService.getAllCoursesOfTeacher(teacher.id))
          .map(([profile, courses]) => {
            teacher.courses = courses;
            teacher.profile = profile;
            return teacher;
          })
      });

    this.listFormSource = this.contentService
      .getActiveCoursesWithTeacher();

    this.listFormMarked = this.dataSource
      .map((teacher: Teacher) => teacher.courses);
  }

  delete(data: Teacher) {
    super.delete(data, appRoutePaths.teachers.path);
  }

  update(data: Teacher) {
    const elementsTobeRemoved = getDifferencesBetween<string>(data.courses, this.infoForm.listForm.getSelecteds());
    const elementsTobeAdded = getDifferencesBetween<string>(this.infoForm.listForm.getSelecteds(), data.courses);
    data.profile = data.profile;
    super.update(data, elementsTobeRemoved, elementsTobeAdded);
  }

}
