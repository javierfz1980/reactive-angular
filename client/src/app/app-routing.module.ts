import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from './content/dashboard/dashboard.component';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./common/guards/auth.guard";
import {RouteElement} from "./common/models/route-element";
import {CoursesComponent} from "./content/courses/courses.component";
import {StudentsComponent} from "./content/students/students.component";
import {TeachersComponent} from "./content/teachers/teachers.component";

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
}

/**
 * Routing strategy:
 * posts/ -> loads PostsComponent
 * post/:id -> loads single Post
 * post/ -> since there is no Id will load /posts
 * anything else -> loads PostsComponent
 * @type {[{path: string; component: PostsComponent},{path: string; component: PostComponent; children: [{path: string; component: PostComponent},{path: string; redirectTo: string; pathMatch: string}]},{path: string; redirectTo: string; pathMatch: string}]}
 */
const appRoutes: Routes = [
  {path: routePaths.login.route, component: LoginComponent},
  {path: routePaths.dashboard.route, component: DashboardComponent, canActivate: [AuthGuard]},
  {path: routePaths.students.route, component: StudentsComponent, canActivate: [AuthGuard]},
  {path: routePaths.courses.route, component: CoursesComponent, canActivate: [AuthGuard]},
  {path: routePaths.teachers.route, component: TeachersComponent, canActivate: [AuthGuard]},
  {path: "**", redirectTo: routePaths.dashboard.route, pathMatch: "full"}

  /*{path: routePaths.posts, component: PostsComponent},
  {path: routePaths.post, component: SinglePostComponent, children: [
    {path: ":id", component: SinglePostComponent},
    {path: "", redirectTo: "/"+routePaths.posts, pathMatch: "full"}
  ]},
  {path: "**", redirectTo: routePaths.posts, pathMatch: "full"},*/
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
