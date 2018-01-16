import {NgModule} from "@angular/core";
import {AuthGuard} from "../../core/providers/guards/auth.guard";
import {TeachersComponent} from "./teachers.component";
import {RouterModule, Routes} from "@angular/router";
import {CreateTeacherComponent} from "./create-teacher/create-teacher.component";
import {RouteElement} from "../../models/core/route-element";
import {SingleTeacherComponente} from "./single-teacher/single-teacher.componente";

export const contentTeachersRoutePaths: {[key:string]: RouteElement} = {
  create: {path: "create", icon: null}
};

export const teachersRoutes: Routes = [
  {path: "", component: TeachersComponent, canActivate: [AuthGuard]},
  {path: "create", component: CreateTeacherComponent, canActivate: [AuthGuard]},
  {path: ":id", component: SingleTeacherComponente, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(teachersRoutes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule {}
