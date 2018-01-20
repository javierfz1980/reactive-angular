import {NgModule} from "@angular/core";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {DashboardComponent} from "./dashboard.component";
import {MostPopularCourseComponent} from "./content/most-popular-course.component";
import {GenericAmountComponent} from "./content/generic-amount.component";

const contents = [
  DashboardComponent,
  MostPopularCourseComponent,
  GenericAmountComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonsModule,
    ContentCommonsModule,
  ],
  exports: [
    ...contents
  ]
})
export class DashboardModule {}
