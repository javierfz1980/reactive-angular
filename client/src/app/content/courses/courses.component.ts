import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/filter";
import {Course} from "../../models/course";
import {ContentService} from "../../core/providers/services/content.service";
import {globalProperties} from "../../../environments/properties";
import {AuthService} from "../../core/providers/services/auth.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {MessageResponse} from "../../models/api/message-response";
import {Subscription} from "rxjs/Subscription";
import {ContentAlert} from "../commons/content-alert/content-alert.component";
import {Observer} from "rxjs/Observer";

@Component({
  selector: "gl-cursos",
  templateUrl: "./courses.component.html"
})
export class CoursesComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal") confirmModal: ConfirmationModalComponent;

  title = "All Courses";
  courses: Observable<Course[]>;
  isAdministrator: boolean;
  modalData: ConfirmationData;
  alert: ContentAlert;

  private subscriptions: Subscription[] = [];
  private coursesPath: string = globalProperties.coursesPath;

  constructor(private contentService: ContentService,
              private authService: AuthService) {}

  ngOnInit() {
    this.fetchContent();
    this.isAdministrator = this.authService.isAdministrator();
  }

  private fetchContent() {
    this.courses = this.contentService
      .getContent<Course[]>(this.coursesPath)
      .catch(error => Observable.throw(error));
  }

  delete(course: Course) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the Course ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(
          this.contentService
            .deleteContent<MessageResponse>(this.coursesPath, course.id)
            .subscribe(
              (response: MessageResponse) => {
                this.modalData.isBusy = false;
                this.alert = {type: "success", message: response.message, time: 3000};
                this.fetchContent();
              },
              (error: any) => {
                this.modalData.isBusy = false;
                this.confirmModal.close();
                this.alert = {type: "danger", message: error.message, time: 3000};
              })
        )}
    };
    this.confirmModal.open();
  }

  toggleStatus(course: Course) {
    this.modalData = {
      type: "confirm",
      title: "Change",
      text: "Are you sure you want to change the Course status ?",
      action: () => {
        this.modalData.isBusy = true;
        this.subscriptions.push(
          this.contentService
            .patchContent<Course>(this.coursesPath, course.id, {active: !course.active})
            .subscribe(
              (response: Course) => {
                this.modalData.isBusy = false;
                this.alert = {type: "success", message: "Course status changed", time: 3000};
                this.fetchContent();
              },
              (error: any) => {
                this.modalData.isBusy = false;
                this.alert = {type: "danger", message: error.message, time: 3000};
              })
        )}
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0)
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
