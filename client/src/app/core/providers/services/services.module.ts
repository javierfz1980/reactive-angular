import {ModuleWithProviders, NgModule} from "@angular/core";
import {AuthService} from "./auth.service";
import {LocalStorageService} from "./local-storage.service";
import {ContentService} from "./content.service";

export const services = [
  AuthService,
  LocalStorageService,
  ContentService
];

@NgModule()
export class ServicesModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [...services]
    };
  }

}
