import {NgModule} from "@angular/core";
import {TeachersComponent} from "./teachers.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {TeachersRoutingModule} from "./teachers-routing.module";

const contents = [
  TeachersComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonsModule,
    ContentCommonsModule,
    TeachersRoutingModule
  ],
  exports: [
    ...contents
  ]
})
export class TeachersModule {}
