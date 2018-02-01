import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {Course} from "../../../models/content/course";
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Student} from "../../../models/content/student";
import {Observable} from "rxjs/Observable";
import {CourseInfoComponent} from "../../commons/info/course-info/course-info.component";
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";
import {StoreData} from "../../../models/core/store-data";

@Component({
  selector: "gl-create-course",
  templateUrl: "./create-course.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCourseComponent extends BasicContentEditor<Course> implements OnInit {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: CourseInfoComponent;

  title: string = "Create new Course";
  listFormSource: Observable<StoreData<Student>>;
  listFormMarked: Observable<string[]>;
  createProvider = this.contentService.createCourse;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService, authService, route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.listFormSource = this.contentService.getStudents();
    this.listFormMarked = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
  }

  create(data: Course) {
    super.create(data, this.infoForm.listForm.getSelecteds());
  }

}
