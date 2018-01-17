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
  isReadOnly: boolean;

  courses: Observable<Course[]>;
  selectedCourses: Course[] = [];

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.courses = this.coursesService
      .getCoursesWithTeachers()
      .map((courses: Course[]) => {
        this.selectedCourses = courses.filter((course: Course) => {
          const linkedToTeacher: boolean = course.teacher && course.teacher === this.link;
          const linkedToStudent: boolean = course.students && course.students
            .some((student: Student) => student.id === this.link);
          return linkedToTeacher || linkedToStudent;
        });
        return (this.isReadOnly ? this.selectedCourses : courses);
      });
  }

  getSelectedCourses(): string[] {
    return this.selectedCourses
      .map((course:Course) => course.id);
  }
}
