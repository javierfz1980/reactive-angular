import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {Course} from "../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";
import {Teacher} from "../../../models/content/teacher";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/combineLatest';

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
    this.readonlyEmitter.next(value);
  }

  courses: Observable<Course[]>;
  selectedCourses: Course[] = [];
  private readonlyEmitter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readOnlyValue: Observable<boolean> = this.readonlyEmitter.asObservable();

  constructor(private contentService: ContentService,
              private router: Router) {}

  ngOnInit() {
    this.courses = this.readOnlyValue
      .combineLatest(
        this.contentService
        .getCourses()
        .filter(data => data !== undefined)
        .switchMap((courses: Course[]) => {
          return Observable.from(courses)
            .mergeMap((course: Course) => {
              if (!course.teacher) return Observable.of(course);
              return this.contentService.getCourseTeacher(course.teacher)
                .map((teacher: Teacher) => {
                  course.teacherInfo = teacher;
                  return course;
                })
            })
            .toArray()
        }))
      .map(([isReadOnly, courses]) => {
        this.selectedCourses = courses
          .filter((course: Course) => this.markedCourses && this.markedCourses
            .some((idCourses: string) => idCourses === course.id)
          );
        if (isReadOnly) {
          const res: Course[] = this.selectedCourses.slice();
          this.selectedCourses = null;
          return res
        } else {
          return courses
        }
      });

    this.contentService.fetchCourses();
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
