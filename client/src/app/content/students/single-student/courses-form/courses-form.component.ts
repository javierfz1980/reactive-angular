import {Component, Input, OnInit} from "@angular/core";
import {Course} from "../../../../models/course";
import {Observable} from "rxjs/Observable";
import {CoursesService} from "../../../../core/providers/services/content/courses.service";

@Component({
  selector: "gl-single-student-courses-form",
  templateUrl: "./courses-form.component.html"
})
export class CoursesFormComponent implements OnInit {

  @Input()
  studentCourses: Course[];

  @Input()
  isReadOnly: boolean;

  courses: Observable<Course[]>;
  selectedCourses: Course[] = [];

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.courses = this.coursesService
      .getCourses()
      .do((courses: Course[]) => {
        courses.forEach((course: Course) => {
          const existsInStudentList: Course = this.studentCourses
            .find(studentCourse => studentCourse.id === course.id);
          if (existsInStudentList) this.selectedCourses.push(course);
        })
      });
  }
}
