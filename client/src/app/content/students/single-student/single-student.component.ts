import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Student} from "../../../models/content/student";
import {Profile} from "../../../models/content/profile";
import {AuthService} from "../../../core/providers/services/auth.service";
import {InfoProfileData} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {CoursesListFormComponent} from "../../commons/forms/lists/courses-list/courses-list-form.component";
import {Course} from "../../../models/content/course";
import {BasicInfoProfileList} from "../../commons/abstarct-clases/basic-info-profile-list";
import {ConfirmationModalComponent} from "../../../commons/confirmation-modal/confirmation-modal.component";
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';

@Component({
  selector: "gl-single-student",
  templateUrl: "./single-student.component.html"
})
export class SingleStudentComponent extends BasicInfoProfileList<InfoProfileData, CoursesListFormComponent, Course>
                                    implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("listForm")
  listForm: CoursesListFormComponent;

  isAlive: boolean = true;

  constructor(private router: Router,
              private contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(authService, route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.id = this.route.params
      .map((params: Params) => {
        this.contentService.fetchStudents(params.id);
        return params.id;
      });

    this.source = this.contentService
      .getStudents()
      .filter(storeData => Boolean(storeData.data))
      .do(data => console.log(data))
      .withLatestFrom(this.id)
      .map(([storeData, id]) => storeData.data.find((student: Student) => student.id === id))
      .filter((student: Student) => Boolean(student))
      .switchMap((student: Student) => {
        return this.contentService.getProfile(student.profile_id)
          .map((profile: Profile) => ({info: student, profile: profile}))
      });

    this.listFormSource = this.contentService
      .getCourses();

    this.listFormMarked = this.source
      .map((data: InfoProfileData) => data.info)
      .map((student: Student) => student.courses);
  }

  delete(data: Student) {
    this.action = () => {
      this.modalData.title = "Deleting";
      this.modalData.isBusy = true;
      this.contentService
        .deleteStudent(data)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
            this.router.navigate([appRoutePaths.students.path]);
          });
    };
    super.openDeleteConfirmation();
  }

  update(data: InfoProfileData) {
    const originalCourses: string[] = data.info.courses;
    data.info.courses = this.listForm.getSelecteds();
    this.action = () => {
      this.modalData.title = "Updating";
      this.modalData.isBusy = true;
      this.contentService
        .updateStudent(data.info, data.profile, this.elementsTobeRemoved, this.elementsTobeAdded)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    };
    super.openUpdateConfirmation(originalCourses, this.listForm.getSelecteds())
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
