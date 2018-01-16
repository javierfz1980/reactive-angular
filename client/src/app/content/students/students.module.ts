import {NgModule} from "@angular/core";
import {StudentsComponent} from "./students.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {StudentsRoutingModule} from "./students-routing.module";
import {SingleStudentComponent} from "./single-student/single-student.component";
import {CreateStudentComponent} from "./create-student/create-student.component";

const contents = [
  StudentsComponent,
  SingleStudentComponent,
  CreateStudentComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonsModule,
    ContentCommonsModule,
    StudentsRoutingModule,
  ],
  exports: [
    ...contents
  ]
})
export class StudentsModule {}
