import {ModuleWithProviders, NgModule} from "@angular/core";
import {AuthGuard} from "./auth.guard";
import {RoleGuard} from "./role.guard";

const guards = [
  AuthGuard,
  RoleGuard
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
