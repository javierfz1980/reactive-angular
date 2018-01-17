import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Subscription} from "rxjs/Subscription";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Course} from "../../../models/content/course";
import {CoursesService} from "../../../core/providers/services/content/courses.service";
import {appRoutePaths} from "../../../app-routing.module";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {CourseStudentsComponent} from "./course-students/course-students.component";

@Component({
  selector: "gl-single-course",
  templateUrl: "./single-course.component.html"
})
export class SingleCourseComponent {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courseStudents")
  students: CourseStudentsComponent;

  alert: ContentAlert;
  info: Observable<any>;
  isAdministrator: boolean;
  editMode: boolean = false;
  modalData: ConfirmationData;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private coursesService: CoursesService) {}

  ngOnInit() {
    this.editMode = this.route.queryParams["value"]["edit"];
    this.isAdministrator = this.authService.isAdministrator();
    this.fetchContent();
  }

  fetchContent() {
    this.info = this.route.params
      .map((params: Params) => params.id)
      .switchMap((id:string) => this.coursesService.getCourse(id))
      .catch((error: any) => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      })
      .do((finalData: Course) => console.log("final data single course: ", finalData));
  }

  delete(course: Course) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete this Course ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(this.coursesService.deleteCourse(course)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.router.navigate([appRoutePaths.courses.path]);
            }));
      }
    };
    this.confirmModal.open();
  }

  update(data: Course) {
    //(<Student>data.info).courses = this.studentCourses.getSelectedCourses();
    data.students = this.students.getSelectedStudents();
    this.modalData = {
      type: "confirm",
      title: "Update",
      text: "Are you sure you want to update this Course ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(this.coursesService.updateCourseInfo(data)
          .subscribe(
            (alert: ContentAlert) => {
              this.alert = alert;
              this.modalData.isBusy = false;
              this.fetchContent();
            }));
      }
    };
    this.confirmModal.open();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0)
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}