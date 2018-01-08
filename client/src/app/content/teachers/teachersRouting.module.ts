import {NgModule} from "@angular/core";
import {AuthGuard} from "../../commons/guards/auth.guard";
import {TeachersComponent} from "./teachers.component";
import {RouterModule, Routes} from "@angular/router";

export const teachersRoutes: Routes = [
  {path: "", component: TeachersComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(teachersRoutes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule {}
