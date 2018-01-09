import {NgModule} from "@angular/core";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {DashboardComponent} from "./dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";

const contents = [
  DashboardComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonsModule,
    ContentCommonsModule,
    DashboardRoutingModule
  ],
  exports: [
    ...contents
  ]
})
export class DashboardModule {}
