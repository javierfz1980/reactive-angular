import {ChangeDetectionStrategy, Component, OnDestroy, ViewChild} from "@angular/core";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {
  InfoProfileData,
  ProfileInfoComponent
} from "../../commons/info/profile-info/profile-info.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Course} from "../../../models/content/course";
import {StoreData} from "../../../models/core/store-data";
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";

@Component({
  selector: "gl-create-teacher",
  templateUrl: "create-teacher.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTeacherComponent extends BasicContentEditor<InfoProfileData> implements OnDestroy{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: ProfileInfoComponent;

  title: string = "Add new Teacher";
  listFormSource: Observable<StoreData<Course>>;
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
