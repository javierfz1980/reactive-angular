import {ModuleWithProviders, NgModule} from "@angular/core";
import {AuthInterceptor} from "./auth.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";

const interceptors = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];

@NgModule()
export class InterceptorsModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: InterceptorsModule,
      providers: [...interceptors]
    };
  }

}
