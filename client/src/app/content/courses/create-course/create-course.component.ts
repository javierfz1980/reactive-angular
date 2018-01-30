import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../../app-routing.module";
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
  templateUrl: "./create-course.component.html"
})
export class CreateCourseComponent extends BasicContentEditor<Course> implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: CourseInfoComponent;

  title: string = "Create new Course";
  listFormSource: Observable<StoreData<Student>>;
  listFormMarked: Observable<string[]>;
  action: () => void;

  private isAlive: boolean = true;

  constructor(protected authService: AuthService,
              private contentService: ContentService,
              private router: Router,
              protected route: ActivatedRoute) {
    super(authService, route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.listFormSource = this.contentService.getStudents(false);
    this.listFormMarked = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
  }

  create(data: Course) {
    this.action = () => {
      this.modalData.title = "Creating";
      this.modalData.isBusy = true;
      this.contentService
        .createCourse(data, this.infoForm.listForm.getSelecteds())
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
            this.router.navigate([appRoutePaths.courses.path])
          });
    };
    this.openCreateConfirmation();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
