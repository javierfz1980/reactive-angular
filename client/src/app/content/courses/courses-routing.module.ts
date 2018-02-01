import {NgModule} from "@angular/core";
import {AuthGuard} from "../../core/providers/guards/auth.guard";
import {CoursesComponent} from "./courses.component";
import {RouterModule, Routes} from "@angular/router";
import {ViewCourseComponent} from "./view-course/view-course.component";
import {CreateCourseComponent} from "./create-course/create-course.component";
import {RoleGuard} from "../../core/providers/guards/role.guard";

export const coursesRoutes: Routes = [
  {path: "", component: CoursesComponent, canActivate: [AuthGuard]},
  {path: "create", component: CreateCourseComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: ":id", component: ViewCourseComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(coursesRoutes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {}
