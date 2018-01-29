import {Component, OnDestroy, ViewChild} from "@angular/core";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {
  InfoProfileData,
  InfoProfileFormComponent
} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Course} from "../../../models/content/course";
import {BasicInfoList} from "../../commons/abstarct-clases/basic-info-list";

@Component({
  selector: "gl-create-teacher",
  templateUrl: "create-teacher.component.html"
})
export class CreateTeacherComponent extends BasicInfoList<InfoProfileData, InfoProfileFormComponent, Course> implements OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: InfoProfileFormComponent;

  title: string = "Add new Teacher";
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
    this.listFormSource = this.contentService.getActiveCoursesWithTeacher();
    this.listFormMarked = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
  }

  create(data: InfoProfileData) {
    this.action = () => {
      this.modalData.title = "Creating";
      this.modalData.isBusy = true;
      this.contentService
        .createTeacher(data.info, data.profile, this.infoForm.listForm.getSelecteds())
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
