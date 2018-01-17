import {Component, Input, OnInit} from "@angular/core";
import {Course} from "../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {CoursesService} from "../../../core/providers/services/content/courses.service";
import {Student} from "../../../models/content/student";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";

@Component({
  selector: "gl-courses-form",
  templateUrl: "./courses-form.component.html",
  styleUrls: ["./courses-form.component.css"]
})
export class CoursesFormComponent implements OnInit {

  @Input()
  set markedCoursesData(data: string[]){
    this.markedCourses = data;
    this.fetchContent();
  };

  markedCourses: string[] = []

  @Input()
  set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    this.fetchContent();
  }

  courses: Observable<Course[]>;
  selectedCourses: Course[] = [];
  private _isReadOnly: boolean;

  constructor(private coursesService: CoursesService,
              private router: Router) {}

  ngOnInit() {
    this.fetchContent();
  }

  fetchContent() {
    this.courses = this.coursesService
      .getCoursesWithTeachers()
      .do(() => console.log("ACA: ", this.markedCourses))
      .map((courses: Course[]) => {
        this.selectedCourses = courses
          .filter((course: Course) => this.markedCourses && this.markedCourses
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

  gotoCourse(id: string) {
    this.router.navigate([appRoutePaths.courses.path, id]);
  }

  gotoTeacher(id: string) {
    this.router.navigate([appRoutePaths.teachers.path, id])
  }

  getSelectedCourses(): string[] {
    return this.selectedCourses
      .map((course:Course) => course.id);
  }
}
