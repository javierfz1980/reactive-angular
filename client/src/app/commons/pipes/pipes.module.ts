import {CapitalizePipe} from "./capitalize.pipe";
import {NgModule} from "@angular/core";
import {TruncatePipe} from "./truncate.pipe";
import {ReversePipe} from "./reverse.pipe";

const declarations = [
  CapitalizePipe,
  TruncatePipe,
  ReversePipe
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
