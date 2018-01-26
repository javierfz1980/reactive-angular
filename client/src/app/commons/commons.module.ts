import {NgModule} from "@angular/core";
import {PipesModule} from "./pipes/pipes.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ClarityModule} from "clarity-angular";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ConfirmationModalComponent} from "./confirmation-modal/confirmation-modal.component";

const modules = [
  CommonModule,
  HttpClientModule,
  ReactiveFormsModule,
  RouterModule,
  ClarityModule,
  PipesModule,
];

const declarations = [
  ConfirmationModalComponent
]

/**
 * This module will include the common functionalities to be used all across the app in order to
 * have them centralized in one module that can be imported on any other module.
 */
@NgModule({
  declarations: [
    ...declarations
  ],
  imports: [
    ...modules
  ],
  exports: [
    ...modules,
    ...declarations
  ]
})
export class CommonsModule {}
