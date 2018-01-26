import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {Course} from "../../../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../../app-routing.module";
import {ContentService} from "../../../../../core/providers/services/content/content.service";
import {BasicListFormComponent} from "../basic-list-form.component";

@Component({
  selector: "gl-courses-list-form",
  templateUrl: "./courses-list-form.component.html",
  styleUrls: ["./courses-list-form.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesListFormComponent extends BasicListFormComponent<Course> implements OnInit {

  courses: Observable<Course[]>;

  constructor(private contentService: ContentService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.courses = this.stream
      .map(([courses, marked, editMode]) => {
        this.selection = courses
          .filter((course: Course) => marked && marked
            .some((idCourses: string) => idCourses === course.id)
          );
        if (editMode) return courses
        const res: Course[] = this.selection.slice();
        this.selection = null;
        return res;
      });

    this.contentService.fetchCourses();
  }

  gotoCourse(id: string) {
    this.router.navigate([appRoutePaths.courses.path, id]);
  }

  gotoTeacher(id: string) {
    this.router.navigate([appRoutePaths.teachers.path, id])
  }
}
