import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {InfoProfileData} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {CoursesListFormComponent} from "../../commons/forms/lists/courses-list/courses-list-form.component";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Course} from "../../../models/content/course";
import {AuthService} from "../../../core/providers/services/auth.service";

@Component({
  selector: "gl-create-student",
  templateUrl: "./create-student.component.html"
})
export class CreateStudentComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("studentCourses")
  studentCourses: CoursesListFormComponent;

  title: string = "Add new Student";
  modalData: ConfirmationData;
  isAdministrator: boolean;

  allCourses: Observable<Course[]>;
  markedCourses: Observable<string[]>;
  isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private isAlive: boolean = true;

  constructor(private contentService: ContentService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();

    this.allCourses = this.contentService.getCourses();
    this.markedCourses = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
  }

  create(data: InfoProfileData) {
    data.info.courses = this.studentCourses.getSelecteds();
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to createData this new Student ?",
      action: () => {
        this.modalData.title = "Creating";
        this.modalData.isBusy = true;
        this.contentService
          .createStudent(data.info, data.profile, this.studentCourses.getSelecteds())
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
              this.router.navigate([appRoutePaths.students.path]);
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
