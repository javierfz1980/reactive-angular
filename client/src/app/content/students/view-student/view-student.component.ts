import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Student} from "../../../models/content/student";
import {Profile} from "../../../models/content/profile";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ProfileInfoComponent
} from "../../commons/info/profile-info/profile-info.component";
import {appRoutePaths} from "../../../app-routing.module";
import {Course} from "../../../models/content/course";
import {ConfirmationModalComponent} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {StoreData} from "../../../models/core/store-data";
import {Observable} from "rxjs/Observable";
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";
import {getDifferencesBetween} from "../../../helpers/helpers";
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';

@Component({
  selector: "gl-view-student",
  templateUrl: "./view-student.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewStudentComponent extends BasicContentEditor<Student>
                                    implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: ProfileInfoComponent;

  listFormSource: Observable<StoreData<Course>>;
  listFormMarked: Observable<string[]>;
  action: () => void;
  private isAlive: boolean = true;

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
        this.contentService.fetchStudents(params.id);
        return params.id;
      });

    this.dataSource = this.contentService
      .getStudents()
      .filter(storeData => Boolean(storeData.data))
      .withLatestFrom(this.id)
      .map(([storeData, id]) => storeData.data.find((student: Student) => student.id === id))
      .filter((student: Student) => Boolean(student))
      .switchMap((student: Student) => {
        return this.contentService.getProfile(student.profile_id)
          //.map((profile: Profile) => ({info: student, profile: profile}))
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
    super.openDeleteConfirmation(`${data.first_name} ${data.last_name}`);
  }

  update(data: Student) {
    const elementsTobeRemoved = getDifferencesBetween<string>(data.courses, this.infoForm.listForm.getSelecteds());
    const elementsTobeAdded = getDifferencesBetween<string>(this.infoForm.listForm.getSelecteds(), data.courses);
    data.courses = this.infoForm.listForm.getSelecteds();
    data.profile = data.profile;
    this.action = () => {
      this.modalData.title = "Updating";
      this.modalData.isBusy = true;
      this.contentService
        .updateStudent(data, elementsTobeRemoved, elementsTobeAdded)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    };
    super.openUpdateConfirmation(`${data.first_name} ${data.last_name}`)
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
