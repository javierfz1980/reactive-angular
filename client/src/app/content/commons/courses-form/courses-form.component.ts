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

  /**
   * The id of the Student or the Teacher in order to show the selected courses for them.
   */
  @Input()
  link: string;

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
        this.selectedCourses = courses.filter((course: Course) => {
          const linkedToTeacher: boolean = course.teacher && course.teacher === this.link;
          const linkedToStudent: boolean = course.students && course.students
            .some((student: Student) => student.id === this.link);
          return linkedToTeacher || linkedToStudent;
        });
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
