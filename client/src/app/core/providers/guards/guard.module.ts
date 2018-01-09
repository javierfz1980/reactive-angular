import {ModuleWithProviders, NgModule} from "@angular/core";
import {AuthGuard} from "./auth.guard";

const guards = [
  AuthGuard
];

@NgModule()
export class GuardModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GuardModule,
      providers: [...guards]
    };
  }

}
