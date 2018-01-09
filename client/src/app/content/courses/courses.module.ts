import {NgModule} from "@angular/core";
import {CoursesComponent} from "./courses.component";
import {CourseCardComponent} from "./course-card/course-card.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {CoursesRoutingModule} from "./courses-routing.module";

const contents = [
  CoursesComponent,
  CourseCardComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonsModule,
    ContentCommonsModule,
    CoursesRoutingModule
  ],
  exports: [
    ...contents
  ]
})
export class CoursesModule {}