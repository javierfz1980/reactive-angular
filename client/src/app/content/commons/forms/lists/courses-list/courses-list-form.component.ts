import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {Course} from "../../../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../../app-routing.module";
import {ContentService} from "../../../../../core/providers/services/content/content.service";
import {BasicListForm} from "../../../abstarct-clases/basic-list-form";
import {StoreData} from "../../../../../models/core/store-data";

@Component({
  selector: "gl-courses-list-form",
  templateUrl: "./courses-list-form.component.html",
  styleUrls: ["./courses-list-form.component.css"],
})
export class CoursesListFormComponent extends BasicListForm<Course> implements OnInit {

  dataSource: Observable<StoreData<Course>>;

  constructor(private contentService: ContentService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.stream
      .map(([storeData, marked, editMode]) => {
        if (!storeData.data) storeData.data = [];
        this.selection = storeData.data
          .filter((course: Course) => marked && marked
            .some((idCourses: string) => idCourses === course.id)
          );
        if (editMode) return storeData;
        const res: Course[] = this.selection.slice();
        this.selection = null;
        return {data: res, loading: storeData.loading};
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
