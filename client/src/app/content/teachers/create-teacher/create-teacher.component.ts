import {Component, OnDestroy, ViewChild} from "@angular/core";
import {CoursesListFormComponent} from "../../commons/forms/lists/courses-list/courses-list-form.component";
import {
  ConfirmationModalData,
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {Router} from "@angular/router";
import {InfoProfileData} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Course} from "../../../models/content/course";
import {StoreData} from "../../../core/providers/services/content/basic-content.service";
import {Teacher} from "../../../models/content/teacher";

@Component({
  selector: "gl-create-teacher",
  templateUrl: "create-teacher.component.html"
})
export class CreateTeacherComponent implements OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courses")
  teacherCourses: CoursesListFormComponent;

  title: string = "Add new Teacher";
  modalData: ConfirmationModalData;
  isAdministrator: boolean;

  listFormSource: Observable<StoreData<Course>>;
  listFormMarked: Observable<string[]>;
  isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private isAlive: boolean = true;

  constructor(private contentService: ContentService,
              private authService: AuthService,
              private router: Router) {
    this.isAdministrator = this.authService.isAdministrator();

    this.listFormSource = this.contentService.getCourses();
    this.listFormMarked = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
  }

  create(data: InfoProfileData) {
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this new Teacher ?",
      action: () => {
        this.modalData.title = "Creating";
        this.modalData.isBusy = true;
        this.contentService
          .createTeacher(data.info, data.profile, this.teacherCourses.getSelecteds())
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
              this.router.navigate([appRoutePaths.teachers.path])
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
