import {CapitalizePipe} from "./capitalize.pipe";
import {NgModule} from "@angular/core";
import {TruncatePipe} from "./truncate.pipe";

const declarations = [
  CapitalizePipe,
  TruncatePipe
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
