import {RouteElement} from "../models/core/route-element";
import {AuthGuard} from "../core/providers/guards/auth.guard";
import {Routes} from "@angular/router";

/**
 * Predefined Routes for Content Module
 * @type {{posts: string; post: string}}
 */
export const contentRoutePaths: {[key:string]: RouteElement} = {
  dashboard: {path: "dashboard", icon: "dashboard"},
  courses: {path: "courses", icon: "library"},
  students: {path: "students", icon: "happy-face"},
  teachers: {path: "teachers", icon: "sad-face"},
};

export const contentRoutesComponents: Routes = [
  {path: contentRoutePaths.dashboard.path,
      loadChildren: "app/content/dashboard/dashboard.module#DashboardModule", canLoad: [AuthGuard]},
  {path: contentRoutePaths.courses.path,
    loadChildren: "app/content/courses/courses.module#CoursesModule", canLoad: [AuthGuard]},
  {path: contentRoutePaths.students.path,
      loadChildren: "app/content/students/students.module#StudentsModule", canLoad: [AuthGuard]},
  {path: contentRoutePaths.teachers.path,
      loadChildren: "app/content/teachers/teachers.module#TeachersModule", canLoad: [AuthGuard]},
];
