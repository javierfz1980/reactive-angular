import {NgModule} from "@angular/core";
import {StudentsComponent} from "./students.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {StudentsRoutingModule} from "./students-routing.module";
import {ViewStudentComponent} from "./view-student/view-student.component";
import {CreateStudentComponent} from "./create-student/create-student.component";
import {CoreModule} from "../../core/core.module";

const contents = [
  StudentsComponent,
  ViewStudentComponent,
  CreateStudentComponent,
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonsModule,
    CoreModule,
    ContentCommonsModule,
    StudentsRoutingModule,
  ],
  exports: [
    ...contents
  ]
})
export class StudentsModule {}
