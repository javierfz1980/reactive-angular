import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Course} from "../../../models/content/course";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Student} from "../../../models/content/student";
import {BasicInfoList} from "../../commons/abstarct-clases/basic-info-list";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {CourseDetailFormComponent} from "../../commons/forms/info/course-info/course-detail-form.component";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-single-course",
  templateUrl: "./single-course.component.html"
})
export class SingleCourseComponent extends BasicInfoList<Course, CourseDetailFormComponent, Student> implements OnInit, OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: CourseDetailFormComponent;

  isAlive: boolean = true;
  action: () => void;

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

    this.source = this.contentService
      .getCourses()
      .filter(storeData => Boolean(storeData.data))
      .withLatestFrom(this.id)
      .map(([storeData, id]) => storeData.data.find((courseData: Course) => courseData.id === id))

    this.listFormSource = this.contentService
      .getStudents(false);

    this.listFormMarked = this.source
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
    super.openDeleteConfirmation();
  }

  update(data: Course) {
    const originalStudents: string[] = data.students;
    data.students = this.infoForm.listForm ? this.infoForm.listForm.getSelecteds() : data.students;
    this.action = () => {
      this.modalData.title = "Updating";
      this.modalData.isBusy = true;
      this.contentService
        .updateCourse(data, this.elementsTobeRemoved, this.elementsTobeAdded)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    };
    super.openUpdateConfirmation(originalStudents,
      this.infoForm.listForm ? this.infoForm.listForm.getSelecteds() : data.students);

  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
