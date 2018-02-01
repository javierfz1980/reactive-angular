import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {
  ProfileInfoComponent
} from "../../commons/info/profile-info/profile-info.component";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../models/content/course";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BasicContentEditor} from "../../commons/abstarct-clases/basic-content-editor";
import {StoreData} from "../../../models/core/store-data";
import {Student} from "../../../models/content/student";

@Component({
  selector: "gl-create-student",
  templateUrl: "./create-student.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStudentComponent extends BasicContentEditor<Student> implements OnInit {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: ProfileInfoComponent;

  title: string = "Add new Student";
  listFormSource: Observable<StoreData<Course>>;
  listFormMarked: Observable<string[]>;
  createProvider = this.contentService.createStudent;

  constructor(protected router: Router,
              protected contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(router, contentService, authService, route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.listFormMarked = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
    this.listFormSource = this.contentService.getActiveCoursesWithTeacher();
  }

  create(data: Student) {
    data.courses = this.infoForm.listForm.getSelecteds();
    data.profile = data.profile;
    super.create(data, this.infoForm.listForm.getSelecteds());
  }

}
