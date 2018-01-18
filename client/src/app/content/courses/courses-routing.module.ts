import {NgModule} from "@angular/core";
import {AuthGuard} from "../../core/providers/guards/auth.guard";
import {CoursesComponent} from "./courses.component";
import {RouterModule, Routes} from "@angular/router";
import {RouteElement} from "../../models/core/route-element";
import {SingleCourseComponent} from "./single-course/single-course.component";
import {CreateCourseComponent} from "./create-course/create-course.component";
import {RoleGuard} from "../../core/providers/guards/role.guard";

export const contentCoursesRoutePaths: {[key:string]: RouteElement} = {
  create: {path: "create", icon: null}
};

export const coursesRoutes: Routes = [
  {path: "", component: CoursesComponent, canActivate: [AuthGuard]},
  {path: "create", component: CreateCourseComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: ":id", component: SingleCourseComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(coursesRoutes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {}
