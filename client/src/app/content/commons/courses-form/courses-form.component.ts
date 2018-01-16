import {Component, Input, OnInit} from "@angular/core";
import {Course} from "../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {CoursesService} from "../../../core/providers/services/content/courses.service";

@Component({
  selector: "gl-courses-form",
  templateUrl: "./courses-form.component.html",
  styleUrls: ["./courses-form.component.css"]
})
export class CoursesFormComponent implements OnInit {

  @Input()
  markedCourses: string[] = [];

  @Input()
  isReadOnly: boolean;

  courses: Observable<Course[]>;
  selectedCourses: Course[] = [];

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.courses = this.coursesService
      .getCoursesWithTeachers()
      .do((courses: Course[]) => {
        courses.forEach((course: Course) => {
          const existsInStudentList: string = this.markedCourses
            .find(studentCourse => studentCourse === course.id);
          if (existsInStudentList) this.selectedCourses.push(course);
        })
      })
      .map((courses: Course[]) => (this.isReadOnly ? this.selectedCourses : courses));
  }

  getSelectedCourses(): string[] {
    return this.selectedCourses
      .map((course:Course) => course.id);
  }
}
