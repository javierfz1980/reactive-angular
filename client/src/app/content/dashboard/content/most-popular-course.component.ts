import {Component, OnInit} from "@angular/core";
import {CoursesService} from "../../../core/providers/services/content/courses.service";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../models/content/course";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";

@Component({
  selector: "gl-most-popular-course",
  templateUrl: "./most-popular-course.component.html",
  styleUrls: ["./most-popular-course.component.css"]
})
export class MostPopularCourseComponent implements OnInit {

  course: Observable<Course>;

  constructor(private coursesService: CoursesService,
              private router: Router) {}

  ngOnInit() {
    this.course = this.coursesService
      .getCourses()
      .map((courses: Course[]) => courses.filter((course: Course) => course.active))
      .map((courses: Course[]) => {
        return courses.reduce((previous: Course, current: Course) => {
          return (current.students && current.students.length >
            (previous.students ? previous.students.length : 0)) ? current : previous;
        })
      })
  }

  gotoCourse(id: string) {
    this.router.navigate([appRoutePaths.courses.path, id]);
  }
}
