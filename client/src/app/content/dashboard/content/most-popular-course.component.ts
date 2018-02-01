import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../models/content/course";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import {StoreData} from "../../../models/core/store-data";

@Component({
  selector: "gl-most-popular-course",
  templateUrl: "./most-popular-course.component.html",
  styleUrls: ["./most-popular-course.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MostPopularCourseComponent implements OnInit {

  course: Observable<Course>;

  constructor(private contentService: ContentService,
              private router: Router) {}

  ngOnInit() {
    this.course = this.contentService
      .getCourses()
      .filter(data => Boolean(data.data))
      .map((storeData: StoreData<Course>) => storeData.data)
      .map((courses: Course[]) => courses && courses.filter((course: Course) => course.active))
      .filter((courses: Course[]) => courses.length > 0)
      .map((courses: Course[]) => {
        return courses.reduce((previous: Course, current: Course) => {
          return (current.students && current.students.length >
            (previous.students ? previous.students.length : 0)) ? current : previous;
        })
      })

    this.contentService.fetchCourses();
  }

  gotoCourse(id: string) {
    this.router.navigate([appRoutePaths.courses.path, id]);
  }
}
