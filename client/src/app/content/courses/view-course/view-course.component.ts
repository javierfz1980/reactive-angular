import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Course} from "../../../models/content/course";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Student} from "../../../models/content/student";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {CourseInfoComponent} from "../../commons/info/course-info/course-info.component";
import 'rxjs/add/operator/takeWhile';
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";
import {StoreData} from "../../../models/core/store-data";
import {Observable} from "rxjs/Observable";
import {getDifferencesBetween} from "../../../helpers/helpers";

@Component({
  selector: "gl-view-course",
  templateUrl: "./view-course.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCourseComponent extends BasicContentEditor<Course> implements OnInit, OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: CourseInfoComponent;

  listFormSource: Observable<StoreData<Student>>;
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
        this.contentService.fetchCourses(params.id);
        return params.id;
      });

    this.dataSource = this.contentService
      .getCourses()
      .filter(storeData => Boolean(storeData.data))
      .withLatestFrom(this.id)
      .map(([storeData, id]) => storeData.data.find((courseData: Course) => courseData.id === id));

    this.listFormSource = this.contentService
      .getStudents();

    this.listFormMarked = this.dataSource
      .map((course: Course) => course ? course.students : []);
  }

  delete(data: Course) {
    this.action = () => {
      this.modalData.title = "Deleting";
      this.modalData.isBusy = true;
      this.contentService
        .deleteCourse(data)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
            this.router.navigate([appRoutePaths.courses.path]);
          });
    };
    super.openDeleteConfirmation(data.title);
  }

  update(data: Course) {
    const elementsTobeRemoved = getDifferencesBetween<string>(data.students, this.infoForm.listForm.getSelecteds());
    const elementsTobeAdded = getDifferencesBetween<string>(this.infoForm.listForm.getSelecteds(), data.students);
    data.students = this.infoForm.listForm ? this.infoForm.listForm.getSelecteds() : data.students;
    this.action = () => {
      this.modalData.title = "Updating";
      this.modalData.isBusy = true;
      this.contentService
        .updateCourse(data, elementsTobeRemoved, elementsTobeAdded)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    };
    super.openUpdateConfirmation1(data.title);

  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
