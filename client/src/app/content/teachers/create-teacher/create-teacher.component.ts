import {Component, OnDestroy, ViewChild} from "@angular/core";
import {CoursesListFormComponent} from "../../commons/forms/lists/courses-list/courses-list-form.component";
import {
  ConfirmationModalData,
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {InfoProfileData} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Course} from "../../../models/content/course";
import {StoreData} from "../../../core/providers/services/content/basic-content.service";
import {Teacher} from "../../../models/content/teacher";
import {BasicInfoProfileList} from "../../commons/abstarct-clases/basic-info-profile-list";

@Component({
  selector: "gl-create-teacher",
  templateUrl: "create-teacher.component.html"
})
export class CreateTeacherComponent extends BasicInfoProfileList<InfoProfileData, CoursesListFormComponent, Course> implements OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("listForm")
  listForm: CoursesListFormComponent;

  title: string = "Add new Teacher";
  private isAlive: boolean = true;

  constructor(protected authService: AuthService,
              private contentService: ContentService,
              private router: Router,
              protected route: ActivatedRoute) {
    super(authService, route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.listFormSource = this.contentService.getCourses();
    this.listFormMarked = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
  }

  create(data: InfoProfileData) {
    this.action = () => {
      this.modalData.title = "Creating";
      this.modalData.isBusy = true;
      this.contentService
        .createTeacher(data.info, data.profile, this.listForm.getSelecteds())
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
            this.router.navigate([appRoutePaths.teachers.path])
          });
    };
    this.openCreateConfirmation();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
