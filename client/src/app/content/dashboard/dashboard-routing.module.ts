import {NgModule} from "@angular/core";
import {AuthGuard} from "../../core/providers/guards/auth.guard";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";

const dashboardRoutes: Routes = [
  {path: "", component: DashboardComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
