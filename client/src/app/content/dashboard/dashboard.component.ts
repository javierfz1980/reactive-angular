import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Router} from "@angular/router";
import {RouteElement} from "../../models/core/route-element";
import {Observable} from "rxjs/Observable";
import {Course} from "../../models/content/course";
import {Student} from "../../models/content/student";
import {Teacher} from "../../models/content/teacher";
import {ContentService} from "../../core/providers/services/content/content.service";
import {StoreData} from "../../models/core/store-data";
import {appRoutePaths} from "../../app-routes";

@Component({
  selector: "gl-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  title: string = "App Dashboard";
  isAdministrator: boolean = false;
  routes:{[key:string]: RouteElement} = appRoutePaths;
  totalCourses: Observable<Course[]>;
  totalTeachers: Observable<Teacher[]>;
  totalStudents: Observable<Student[]>;

  constructor(private authService: AuthService,
              private contentService: ContentService,
              private router: Router) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();

    this.totalCourses = this.contentService
      .getCourses()
      .map((data: StoreData<Course>) => !data.data ? [] : data.data
        .filter((course: Course) => course.active));

    this.totalTeachers = this.contentService
      .getTeachers()
      .map((data: StoreData<Teacher>) => data.data);

    this.totalStudents = this.contentService
      .getStudents()
      .map((data: StoreData<Student>) => data.data);

    this.contentService.fetchCourses();
    this.contentService.fetchTeachers();
    this.contentService.fetchStudents();
  }

  navigateTo(destination: string) {
    this.router.navigate([destination]);
  }
}
