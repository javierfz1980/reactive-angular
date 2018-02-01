import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
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
export class ViewCourseComponent extends BasicContentEditor<Course> implements OnInit {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: CourseInfoComponent;

  contentProvider = this.contentService.getCourses;
  fetchProvider = this.contentService.fetchCourses;
  deleteProvider = this.contentService.deleteCourse;
  updateProvider = this.contentService.updateCourse;

  listFormSource: Observable<StoreData<Student>>;
  listFormMarked: Observable<string[]>;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService, authService, route);
  }

  ngOnInit() {
    super.ngOnInit();

    this.listFormSource = this.contentService
      .getStudents();

    this.listFormMarked = this.dataSource
      .map((course: Course) => course ? course.students : []);
  }

  delete(data: Course) {
    super.delete(data, appRoutePaths.courses.path);
  }

  update(data: Course) {
    const elementsTobeRemoved = getDifferencesBetween<string>
      (data.students, this.infoForm.listForm ? this.infoForm.listForm.getSelecteds() : []);
    const elementsTobeAdded = getDifferencesBetween<string>
      (this.infoForm.listForm ? this.infoForm.listForm.getSelecteds() : [], data.students);
    data.students = this.infoForm.listForm ? this.infoForm.listForm.getSelecteds() : data.students;
    super.update(data, elementsTobeRemoved, elementsTobeAdded);

  }

}
