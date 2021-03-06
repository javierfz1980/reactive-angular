import {NgModule} from "@angular/core";
import {CoursesComponent} from "./courses.component";
import {CourseCardComponent} from "./course-card/course-card.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {CoursesRoutingModule} from "./courses-routing.module";
import {ViewCourseComponent} from "./view-course/view-course.component";
import {CreateCourseComponent} from "./create-course/create-course.component";

const contents = [
  CoursesComponent,
  CourseCardComponent,
  ViewCourseComponent,
  CreateCourseComponent
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
