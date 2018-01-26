import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../core/providers/services/auth.service";
import {
  ConfirmationModalData,
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {appRoutePaths} from "../../../app-routing.module";
import {Course} from "../../../models/content/course";
import {StudentsListFormComponent} from "../../commons/forms/lists/students-list/students-list-form.component";
import {Router} from "@angular/router";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Student} from "../../../models/content/student";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: "gl-create-course",
  templateUrl: "./create-course.component.html"
})
export class CreateCourseComponent implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("courseStudents")
  students: StudentsListFormComponent;

  title: string = "Create new Course";
  isAdministrator: boolean;
  modalData: ConfirmationModalData;

  allStudents: Observable<Student[]>;
  markedStudents: Observable<string[]>;
  isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private isAlive: boolean = true;

  constructor(private authService: AuthService,
              private contentService: ContentService,
              private router: Router) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();

    this.allStudents = this.contentService.getStudents();
    this.markedStudents = Observable.of([]);
    this.isEditMode.next((this.isAdministrator && true));
  }

  create(data: Course) {
    this.modalData = {
      type: "confirm",
      title: "Create",
      text: "Are you sure you want to create this new Course?",
      action: () => {
        this.modalData.title = "Creating";
        this.modalData.isBusy = true;
        this.contentService
          .createCourse(data, this.students.getSelecteds())
          .takeWhile(() => this.isAlive)
          .subscribe(
            () => {
              this.modalData.isBusy = false;
              this.confirmModal.close();
              this.router.navigate([appRoutePaths.courses.path])
            });
      }
    };
    this.confirmModal.open();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
