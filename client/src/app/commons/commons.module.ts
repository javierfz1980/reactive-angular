import {NgModule} from "@angular/core";
import {GuardModule} from "./guards/guard.module";
import {ServicesModule} from "./services/services.module";
import {InterceptorsModule} from "./interceptors/interceptors.module";
import {PipesModule} from "./pipes/pipes.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ClarityModule} from "clarity-angular";
import {ContentModule} from "../content/content.module";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";


/**
 * This module will include the common functionalities to be used all across the app in order to
 * have them centralized in one module that can be imported on any other module.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ClarityModule,
    ContentModule,
    BrowserModule,
    PipesModule,
    GuardModule.forRoot(),
    ServicesModule.forRoot(),
    InterceptorsModule.forRoot(),
  ],
  exports: [
    PipesModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ClarityModule,
    ContentModule,
    BrowserModule,
  ]
})
export class CommonsModule {}
