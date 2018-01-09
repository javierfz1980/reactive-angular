import {NgModule} from "@angular/core";
import {StudentsComponent} from "./students.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {StudentsRoutingModule} from "./students-routing.module";

const contents = [
  StudentsComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonsModule,
    ContentCommonsModule,
    StudentsRoutingModule
  ],
  exports: [
    ...contents
  ]
})
export class StudentsModule {}
