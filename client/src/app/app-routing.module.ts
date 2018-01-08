import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from './content/dashboard/dashboard.component';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./commons/guards/auth.guard";
import {RouteElement} from "./commons/models/route-element";

/**
 * Predefined Routes
 * @type {{posts: string; post: string}}
 */
export const routePaths: {[key:string]: RouteElement} = {
  login: {route: "login", icon: "info-circle"},
  dashboard: {route: "dashboard", icon: "dashboard"},
  students: {route: "students", icon: "happy-face"},
  courses: {route: "courses", icon: "library"},
  teachers: {route: "teachers", icon: "sad-face"},
};

const appRoutes: Routes = [
  {path: routePaths.login.route, component: LoginComponent},
  {path: routePaths.dashboard.route, component: DashboardComponent, canActivate: [AuthGuard]},
  {path: routePaths.students.route, loadChildren: "app/content/students/students.module#StudentsModule", canLoad: [AuthGuard]},
  {path: routePaths.courses.route, loadChildren: "app/content/courses/courses.module#CoursesModule", canLoad: [AuthGuard]},
  {path: routePaths.teachers.route, loadChildren: "app/content/teachers/teachers.module#TeachersModule", canLoad: [AuthGuard]},
  {path: "**", redirectTo: routePaths.dashboard.route, pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
