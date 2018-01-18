import {NgModule} from "@angular/core";
import {CoursesComponent} from "./courses.component";
import {CourseCardComponent} from "./course-card/course-card.component";
import {ContentCommonsModule} from "../commons/content-commons-module";
import {CommonsModule} from "../../commons/commons.module";
import {CoursesRoutingModule} from "./courses-routing.module";
import {SingleCourseComponent} from "./single-course/single-course.component";
import {CourseInfoComponent} from "./single-course/course-info/course-info.component";
import {CourseStudentsComponent} from "./single-course/course-students/course-students.component";
import {CreateCourseComponent} from "./create-course/create-course.component";

const contents = [
  CoursesComponent,
  CourseCardComponent,
  SingleCourseComponent,
  CourseInfoComponent,
  CourseStudentsComponent,
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
