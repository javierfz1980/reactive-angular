import {NgModule} from "@angular/core";
import {GuardModule} from "./guards/guard.module";
import {ServicesModule} from "./services/services.module";
import {InterceptorsModule} from "./interceptors/interceptors.module";
import {PipesModule} from "./pipes/pipes.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ClarityModule} from "clarity-angular";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

const contents = [
  CommonModule,
  HttpClientModule,
  ReactiveFormsModule,
  ClarityModule,
  PipesModule
];

/**
 * This module will include the common functionalities to be used all across the app in order to
 * have them centralized in one module that can be imported on any other module.
 */
@NgModule({
  declarations: [],
  imports: [
    ...contents
  ],
  exports: [
    ...contents
  ]
})
export class AppCommonsModule {}
