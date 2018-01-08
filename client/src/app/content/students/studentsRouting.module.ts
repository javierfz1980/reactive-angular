import {NgModule} from "@angular/core";
import {AuthGuard} from "../../commons/guards/auth.guard";
import {StudentsComponent} from "./students.component";
import {RouterModule, Routes} from "@angular/router";

const studentsRoutes: Routes = [
  {path: "", component: StudentsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(studentsRoutes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {}
