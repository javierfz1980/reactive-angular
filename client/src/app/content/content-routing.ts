import {RouteElement} from "../models/core/route-element";
import {AuthGuard} from "../core/providers/guards/auth.guard";
import {Routes} from "@angular/router";
import {contentStudentsRoutePaths} from "./students/students-routing.module";
import {contentTeachersRoutePaths} from "./teachers/teachers-routing.module";
import {contentCoursesRoutePaths} from "./courses/courses-routing.module";
import {DashboardComponent} from "./dashboard/dashboard.component";

/**
 * Predefined Routes for Content Module
 * @type {{posts: string; post: string}}
 */
export const contentRoutePaths: {[key:string]: RouteElement} = {
  dashboard: {path: "dashboard", icon: "dashboard"},
  courses: {path: "courses", icon: "library", childs: contentCoursesRoutePaths},
  students: {path: "students", icon: "happy-face", childs: contentStudentsRoutePaths},
  teachers: {path: "teachers", icon: "sad-face", childs: contentTeachersRoutePaths},

};

export const contentRoutesComponents: Routes = [
  {path: contentRoutePaths.dashboard.path, component: DashboardComponent, canActivate: [AuthGuard]},
  {path: contentRoutePaths.courses.path,
    loadChildren: "app/content/courses/courses.module#CoursesModule", canLoad: [AuthGuard]},
  {path: contentRoutePaths.students.path,
      loadChildren: "app/content/students/students.module#StudentsModule", canLoad: [AuthGuard]},
  {path: contentRoutePaths.teachers.path,
      loadChildren: "app/content/teachers/teachers.module#TeachersModule", canLoad: [AuthGuard]},
];
