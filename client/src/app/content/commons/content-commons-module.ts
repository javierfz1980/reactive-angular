import {ContentLoaderComponent} from "./loader/content-loader.component";
import {NgModule} from "@angular/core";
import {ConfirmationModalComponent} from "./confirmation-modal/confirmation-modal.component";
import {CommonsModule} from "../../commons/commons.module";
import {CoursesListFormComponent} from "./forms/lists/courses-list/courses-list-form.component";
import {InfoProfileFormComponent} from "./forms/info/info-profile/info-profile-form.component";

const contents = [
  ContentLoaderComponent,
  ConfirmationModalComponent,
  InfoProfileFormComponent,
  CoursesListFormComponent
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
