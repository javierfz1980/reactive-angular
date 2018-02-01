import {AuthGuard} from "../core/providers/guards/auth.guard";
import {Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {contentRoutePaths} from "./content-routes";

export const contentRoutesComponents: Routes = [
  {path: contentRoutePaths.dashboard.path, component: DashboardComponent, canActivate: [AuthGuard]},
  {path: contentRoutePaths.courses.path,
    loadChildren: "app/content/courses/courses.module#CoursesModule", canLoad: [AuthGuard]},
  {path: contentRoutePaths.students.path,
      loadChildren: "app/content/students/students.module#StudentsModule", canLoad: [AuthGuard]},
  {path: contentRoutePaths.teachers.path,
      loadChildren: "app/content/teachers/teachers.module#TeachersModule", canLoad: [AuthGuard]},
];
