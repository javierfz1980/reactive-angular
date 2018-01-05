import {CapitalizePipe} from "./capitalize.pipe";
import {NgModule} from "@angular/core";

const declarations = [
  CapitalizePipe
];

@NgModule({
  declarations: [
    ...declarations
  ],
  exports: [
    ...declarations
  ]
})
export class PipesModule {}
