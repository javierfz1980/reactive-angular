import {ContentLoaderComponent} from "./loader/content-loader.component";
import {NgModule} from "@angular/core";
import {ConfirmationModalComponent} from "./confirmation-modal/confirmation-modal.component";
import {CommonsModule} from "../../commons/commons.module";
import {ContentInfoComponent} from "./info-form/info-form.component";
import {CoursesFormComponent} from "./courses-form/courses-form.component";

const contents = [
  ContentLoaderComponent,
  ConfirmationModalComponent,
  ContentInfoComponent,
  CoursesFormComponent
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
