import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {
  ProfileInfoComponent
} from "../../commons/info/profile-info/profile-info.component";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Course} from "../../../models/content/course";
import {StoreData} from "../../../models/core/store-data";
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";
import {Teacher} from "../../../models/content/teacher";
import {appRoutePaths} from "../../../app-routing.module";

@Component({
  selector: "gl-create-teacher",
  templateUrl: "create-teacher.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTeacherComponent extends BasicContentEditor<Teacher> implements OnInit{

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: ProfileInfoComponent;

  title: string = "Add new Teacher";
  listFormSource: Observable<StoreData<Course>>;
  listFormMarked: Observable<string[]>;
  createProvider = this.contentService.createTeacher;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService, authService, route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.listFormSource = this.contentService.getActiveCoursesWithTeacher();
    this.listFormMarked = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
  }

  create(data: Teacher) {
    data.courses = this.infoForm.listForm.getSelecteds();
    data.profile = data.profile;
    super.create(data, this.infoForm.listForm.getSelecteds(), appRoutePaths.teachers.path);
  }

}
