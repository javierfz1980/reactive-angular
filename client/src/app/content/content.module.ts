import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CoursesComponent} from "./courses/courses.component";
import {TeachersComponent} from "./teachers/teachers.component";
import {StudentsComponent} from "./students/students.component";
import {CommonModule} from "@angular/common";
import {ClarityModule} from "clarity-angular";

const contents = [
  DashboardComponent,
  CoursesComponent,
  TeachersComponent,
  StudentsComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  imports: [
    CommonModule,
    ClarityModule
  ],
  exports: [
    ...contents
  ]
})
export class ContentModule {

}
