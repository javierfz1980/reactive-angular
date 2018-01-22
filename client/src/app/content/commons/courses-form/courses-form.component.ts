import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {Course} from "../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {CoursesService} from "../../../core/providers/services/content/courses.service";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";
import {Teacher} from "../../../models/content/teacher";

@Component({
  selector: "gl-courses-form",
  templateUrl: "./courses-form.component.html",
  styleUrls: ["./courses-form.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesFormComponent implements OnInit {

  @Input()
  markedCourses: string[] = [];

  @Input()
  set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    this.coursesService.fetchData();
  }

  courses: Observable<Course[]>;
  selectedCourses: Course[] = [];
  private _isReadOnly: boolean;

  constructor(private coursesService: CoursesService,
              private router: Router) {}

  ngOnInit() {
    this.courses = this.coursesService
      .courses
      .switchMap((courses: Course[]) => {
        return Observable.from(courses)
          .mergeMap((course: Course) => {
            if (!course.teacher) return Observable.of(course);
            return this.coursesService.getCourseTeacher(course.teacher)
              .map((teacher: Teacher) => {
                course.teacherInfo = teacher;
                return course;
              })
          })
          .toArray()
      })
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

    this.coursesService.fetchData();
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
