import {ContentLoaderComponent} from "./loader/content-loader.component";
import {NgModule} from "@angular/core";
import {ConfirmationModalComponent} from "./confirmation-modal/confirmation-modal.component";
import {CommonsModule} from "../../commons/commons.module";
import {ContentAlertComponent} from "./alert/content-alert.component";
import {ContentInfoComponent} from "./info-form/info-form.component";

const contents = [
  ContentLoaderComponent,
  ConfirmationModalComponent,
  ContentAlertComponent,
  ContentInfoComponent,
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
