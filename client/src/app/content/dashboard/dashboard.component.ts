import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../app-routing.module";
import {RouteElement} from "../../models/core/route-element";
import {Observable} from "rxjs/Observable";
import {Course} from "../../models/content/course";
import {Student} from "../../models/content/student";
import {Teacher} from "../../models/content/teacher";
import {ContentService} from "../../core/providers/services/content/content.service";

@Component({
  selector: "gl-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {

  title: string = "App Dashboard";
  isAdministrator: boolean = false;
  routes:{[key:string]: RouteElement} = appRoutePaths;
  totalCourses: Observable<number>;
  totalTeachers: Observable<number>;
  totalStudents: Observable<number>;

  constructor(private authService: AuthService,
              private contentService: ContentService,
              private router: Router) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();

    this.totalCourses = this.contentService
      .getCourses()
      .map((courses: Course[]) => courses.length);

    this.totalTeachers = this.contentService
      .getTeachers()
      .map((teachers: Teacher[]) => teachers.length);

    this.totalStudents = this.contentService
      .getStudents()
      .map((students: Student[]) => students.length);

    this.contentService.fetchCourses();
    this.contentService.fetchTeachers();
    this.contentService.fetchStudents();
  }

  navigateTo(destination: string) {
    console.log(destination);
    this.router.navigate([destination]);
  }
}
