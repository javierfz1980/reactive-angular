import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard/dashboard.component";

const contents = [
  DashboardComponent,
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [],
  exports: [
    ...contents
  ]
})
export class ContentModule {

}
