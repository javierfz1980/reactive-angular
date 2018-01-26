import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Course} from "../../../models/content/course";
import {appRoutePaths} from "../../../app-routing.module";
import {StudentsListFormComponent} from "../../commons/forms/lists/students-list/students-list-form.component";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {Student} from "../../../models/content/student";
import {BasicSingleEditorWithList} from "../../commons/abstarct-clases/basic-single-editor-with-list";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "gl-single-course",
  templateUrl: "./single-course.component.html"
})
export class SingleCourseComponent extends BasicSingleEditorWithList<Course, StudentsListFormComponent, Student> implements OnInit, OnDestroy{

  constructor(private router: Router,
              private contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(authService, route);
  }

  ngOnInit() {
    super.ngOnInit();

    // The id of the current course
    this.id = this.route.params
      .map((params: Params) => {
        this.contentService.fetchCourses(params.id);
        return params.id;
      });

    // The course
    this.source = this.contentService
      .getCourses()
      .withLatestFrom(this.id)
      .map(([courses, id]) => courses.find((courseData: Course) => courseData.id === id));

    // The source for the list component
    this.listFormSource = this.contentService
      .getStudents();

    // The elements that should be marked as selected on the list component
    this.listFormMarked = this.source
      .map((course: Course) => course ? course.students : []);
  }

  delete(data: Course) {
    this.action = () => {
      this.modalData.title = "Deleting";
      this.modalData.isBusy = true;
      this.contentService
        .deleteCourse(data)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
            this.router.navigate([appRoutePaths.courses.path]);
          });
    };
    super.openDeleteModal();
  }

  update(data: Course) {
    const originalStudents: string[] = data.students;
    data.students = this.listForm.getSelecteds();
    this.action = () => {
      this.modalData.title = "Updating";
      this.modalData.isBusy = true;
      this.contentService
        .updateCourse(data, this.elementsTobeRemoved, this.elementsTobeAdded)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    };
    super.openUpdateModal(originalStudents, this.listForm.getSelecteds());

  }

  toggleEditMode() {
    super.toggleEditMode();
  }

}
