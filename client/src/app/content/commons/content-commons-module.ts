import {ContentLoaderComponent} from "./loader/content-loader.component";
import {NgModule} from "@angular/core";
import {CommonsModule} from "../../commons/commons.module";
import {CoursesListFormComponent} from "./forms/lists/courses-list/courses-list-form.component";
import {InfoProfileFormComponent} from "./forms/info/info-profile/info-profile-form.component";
import {StudentsListFormComponent} from "./forms/lists/students-list/students-list-form.component";
import {CourseDetailFormComponent} from "./forms/info/course-info/course-detail-form.component";

const contents = [
  ContentLoaderComponent,
  InfoProfileFormComponent,
  CoursesListFormComponent,
  CourseDetailFormComponent,
  StudentsListFormComponent
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
