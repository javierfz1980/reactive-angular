import {Component, Input, OnInit} from "@angular/core";
import {Course} from "../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {CoursesService} from "../../../core/providers/services/content/courses.service";
import {Student} from "../../../models/content/student";

@Component({
  selector: "gl-courses-form",
  templateUrl: "./courses-form.component.html",
  styleUrls: ["./courses-form.component.css"]
})
export class CoursesFormComponent implements OnInit {

  @Input()
  markedCourses: string[] = [];

  @Input()
  set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    this.fetchContent();
  }

  courses: Observable<Course[]>;
  selectedCourses: Course[] = [];
  private _isReadOnly: boolean;

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.fetchContent();
  }

  fetchContent() {
    this.courses = this.coursesService
      .getCoursesWithTeachers()
      .map((courses: Course[]) => {
        this.selectedCourses = courses
          .filter((course: Course) => this.markedCourses
            .some((idCourses: string) => idCourses === course.id)
        );
        if (this._isReadOnly) {
          const res: Course[] = this.selectedCourses.slice();
          this.selectedCourses = null;
          return res
        } else {
          return courses
        }
      });
  }

  getSelectedCourses(): string[] {
    return this.selectedCourses
      .map((course:Course) => course.id);
  }
}
