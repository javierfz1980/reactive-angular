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
  subscription: Subscription;
  busy: boolean = false;

  private coursesPath: string = globalProperties.coursesPath;

  constructor(private contentService: ContentService,
              private authService: AuthService) {}

  ngOnInit() {
    this.fetchContent();
    this.isAdministrator = this.authService.isAdministrator();

  }

  fetchContent() {
    this.courses = this.contentService
      .getContent<Course[]>(this.coursesPath)
      .catch(error => Observable.throw(error));
  }

  deleteCourse(course: Course) {
    this.modalData = {
      type: "delete",
      title: "Delete",
      text: "Are you sure you want to delete the element ?",
      action: this.delete(course)
    };
    this.confirmModal.open();
  }

  private delete(course: Course) {
    return () => {
      this.busy = true;
      this.subscription = this.contentService.deleteContent<MessageResponse>(this.coursesPath, course.id)
        .map((response: MessageResponse) => {
          this.alert = {type: "success", message: response.message, time: 3000};
          this.busy = false;
          this.fetchContent();
        })
        .catch(error => {
          this.busy = false;
          this.alert = {type: "danger", message: error};
          return Observable.throw(error);
        })
        .subscribe();
    }
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
