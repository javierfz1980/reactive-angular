import {Component, OnInit} from "@angular/core";
import {Course} from "../../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../app-routing.module";
import {ContentService} from "../../../../core/providers/services/content/content.service";
import {BasicList} from "../../abstarct-clases/basic-list";
import {StoreData} from "../../../../models/core/store-data";

@Component({
  selector: "gl-courses-list",
  templateUrl: "./courses-list.component.html",
  styleUrls: ["./courses-list.component.css"],
})
export class CoursesListComponent extends BasicList<Course> implements OnInit {

  dataSource: Observable<StoreData<Course>>;

  constructor(private router: Router,
              protected contentService: ContentService) {
    super(contentService);
  }

  gotoCourse(id: string) {
    this.router.navigate([appRoutePaths.courses.path, id]);
  }

  gotoTeacher(id: string) {
    this.router.navigate([appRoutePaths.teachers.path, id])
  }
}
