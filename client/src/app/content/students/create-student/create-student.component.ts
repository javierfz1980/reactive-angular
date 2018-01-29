import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {
  InfoProfileData,
  InfoProfileFormComponent
} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../models/content/course";
import {AuthService} from "../../../core/providers/services/auth.service";
import {BasicInfoList} from "../../commons/abstarct-clases/basic-info-list";
import {StoreData} from "../../../models/core/store-data";
import {Teacher} from "../../../models/content/teacher";

@Component({
  selector: "gl-create-student",
  templateUrl: "./create-student.component.html"
})
export class CreateStudentComponent extends BasicInfoList<InfoProfileData, InfoProfileFormComponent, Course> implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: InfoProfileFormComponent;

  title: string = "Add new Student";
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
    this.listFormSource = this.contentService
      .getCourses()
      .map((data: StoreData<Course>) => {
        data.data = !data.data ? [] : data.data
          .filter((course: Course) => course.active);
        return data;
      })
      .switchMap((data: StoreData<Course>) => {
        return Observable.from(data.data ? data.data : [])
          .mergeMap((course: Course) => {
            return this.contentService.getCourseTeacher(course.teacher)
              .map((teacher: Teacher) => {
                course.teacherInfo = teacher
                return course;
              })
          })
          .toArray()
          .map((coursesWithTeacher: Course[]) => {
            data.data = coursesWithTeacher;
            return data;
          });
      });
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
