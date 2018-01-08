import {NgModule} from "@angular/core";
import {AuthGuard} from "../../commons/guards/auth.guard";
import {CoursesComponent} from "./courses.component";
import {RouterModule, Routes} from "@angular/router";

export const coursesRoutes: Routes = [
  {path: "", component: CoursesComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(coursesRoutes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {}
