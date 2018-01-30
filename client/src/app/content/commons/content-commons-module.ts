import {ContentLoaderComponent} from "./loader/content-loader.component";
import {NgModule} from "@angular/core";
import {CommonsModule} from "../../commons/commons.module";
import {CoursesListComponent} from "./lists/courses-list/courses-list.component";
import {ProfileInfoComponent} from "./info/profile-info/profile-info.component";
import {StudentsListComponent} from "./lists/students-list/students-list.component";
import {CourseInfoComponent} from "./info/course-info/course-info.component";

const contents = [
  ContentLoaderComponent,
  ProfileInfoComponent,
  CoursesListComponent,
  CourseInfoComponent,
  StudentsListComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonsModule
  ],
  exports: [
    ...contents
  ]
})
export class ContentCommonsModule {}
