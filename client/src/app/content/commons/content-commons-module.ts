import {ContentLoaderComponent} from "./content-loader/content-loader.component";
import {NgModule} from "@angular/core";
import {ConfirmationModalComponent} from "./confirmation-modal/confirmation-modal.component";
import {CommonsModule} from "../../commons/commons.module";
import {ContentAlertComponent} from "./content-alert/content-alert.component";

const contents = [
  ContentLoaderComponent,
  ConfirmationModalComponent,
  ContentAlertComponent
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
