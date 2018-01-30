import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {
  InfoProfileData,
  ProfileInfoComponent
} from "../../commons/info/profile-info/profile-info.component";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../models/content/course";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";
import {StoreData} from "../../../models/core/store-data";

@Component({
  selector: "gl-create-student",
  templateUrl: "./create-student.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStudentComponent extends BasicContentEditor<InfoProfileData> implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: ProfileInfoComponent;

  title: string = "Add new Student";
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
    this.listFormMarked = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
    this.listFormSource = this.contentService.getActiveCoursesWithTeacher();
  }

  create(data: InfoProfileData) {
    data.info.courses = this.infoForm.listForm.getSelecteds();
    this.action = () => {
      this.modalData.title = "Creating";
      this.modalData.isBusy = true;
      this.contentService
        .createStudent(data.info, data.profile, this.infoForm.listForm.getSelecteds())
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
            this.router.navigate([appRoutePaths.students.path]);
          });
    };
    this.openCreateConfirmation();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
