import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CoursesComponent} from "./courses/courses.component";
import {TeachersComponent} from "./teachers/teachers.component";
import {StudentsComponent} from "./students/students.component";
import {CommonModule} from "@angular/common";
import {ClarityModule} from "clarity-angular";
import {PipesModule} from "../common/pipes/pipes.module";
import {CourseCardComponent} from "./courses/course-card/course-card.component";
import {ContentLoaderComponent} from "./content-loader/content-loader.component";

const contents = [
  DashboardComponent,
  CoursesComponent,
  CourseCardComponent,
  TeachersComponent,
  StudentsComponent,
  ContentLoaderComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonModule,
    ClarityModule,
    PipesModule
  ],
  exports: [
    ...contents
  ]
})
export class ContentModule {

}
