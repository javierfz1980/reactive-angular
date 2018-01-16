import {NgModule} from "@angular/core";
import {TeachersComponent} from "./teachers.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {TeachersRoutingModule} from "./teachers-routing.module";
import {CreateTeacherComponent} from "./create-teacher/create-teacher.component";
import {SingleTeacherComponente} from "./single-teacher/single-teacher.componente";

const contents = [
  TeachersComponent,
  CreateTeacherComponent,
  SingleTeacherComponente
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
