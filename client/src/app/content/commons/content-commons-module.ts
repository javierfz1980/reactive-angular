import {ContentLoaderComponent} from "./content-loader/content-loader.component";
import {NgModule} from "@angular/core";

const contents = [
  ContentLoaderComponent
];

@NgModule({
  declarations: [
    ...contents
  ],
  exports: [
    ...contents
  ]
})
export class ContentCommonsModule {}
