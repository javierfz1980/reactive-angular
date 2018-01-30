import {NgModule} from "@angular/core";
import {AuthGuard} from "../../core/providers/guards/auth.guard";
import {StudentsComponent} from "./students.component";
import {RouterModule, Routes} from "@angular/router";
import {ViewStudentComponent} from "./view-student/view-student.component";
import {CreateStudentComponent} from "./create-student/create-student.component";
import {RouteElement} from "../../models/core/route-element";
import {RoleGuard} from "../../core/providers/guards/role.guard";

export const contentStudentsRoutePaths: {[key:string]: RouteElement} = {
  create: {path: "create", icon: null}
};

const studentsRoutes: Routes = [
  {path: "", component: StudentsComponent, canActivate: [AuthGuard]},
  {path: "create", component: CreateStudentComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: ":id", component: ViewStudentComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(studentsRoutes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {}
