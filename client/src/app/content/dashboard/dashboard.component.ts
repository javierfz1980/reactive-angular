import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../app-routing.module";
import {RouteElement} from "../../models/core/route-element";
import {Observable} from "rxjs/Observable";
import {Course} from "../../models/content/course";
import {CoursesService} from "../../core/providers/services/content/courses.service";
import {TeachersService} from "../../core/providers/services/content/teachers.service";
import {
  StudentsService
} from "../../core/providers/services/content/students.service";
import {Student} from "../../models/content/student";
import {Teacher} from "../../models/content/teacher";

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

  constructor(private coursesService: CoursesService,
              private teachersService: TeachersService,
              private studentsService: StudentsService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();

    this.totalCourses = this.coursesService
      .getCourses()
      .map((courses: Course[]) => courses.length);

    this.totalTeachers = this.teachersService
      .teachers
      .map((teachers: Teacher[]) => teachers.length);

    this.totalStudents = this.studentsService
      .students
      .map((students: Student[]) => students.length);

    this.studentsService.fetchData();
    this.teachersService.fetchData();
  }

  navigateTo(destination: string) {
    console.log(destination);
    this.router.navigate([destination]);
  }
}
