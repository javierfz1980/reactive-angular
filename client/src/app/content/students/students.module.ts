import {NgModule} from "@angular/core";
import {StudentsComponent} from "./students.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {AppCommonsModule} from "../../commons/app-commons.module";
import {StudentsRoutingModule} from "./studentsRouting.module";

const contents = [
  StudentsComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    AppCommonsModule,
    ContentCommonsModule,
    StudentsRoutingModule
  ],
  exports: [
    ...contents
  ]
})
export class StudentsModule {}
