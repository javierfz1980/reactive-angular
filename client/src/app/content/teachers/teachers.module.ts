import {NgModule} from "@angular/core";
import {TeachersComponent} from "./teachers.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {AppCommonsModule} from "../../commons/app-commons.module";
import {TeachersRoutingModule} from "./teachersRouting.module";

const contents = [
  TeachersComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    AppCommonsModule,
    ContentCommonsModule,
    TeachersRoutingModule
  ],
  exports: [
    ...contents
  ]
})
export class TeachersModule {}
