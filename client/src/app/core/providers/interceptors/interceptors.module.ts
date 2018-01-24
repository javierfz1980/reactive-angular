import {ModuleWithProviders, NgModule} from "@angular/core";
import {AuthInterceptor} from "./auth.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";

export const interceptors = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];

@NgModule({
  providers: [...interceptors]
})
export class InterceptorsModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: InterceptorsModule,
      providers: [...interceptors]
    };
  }

  static forCore(): any[] {
    return [...interceptors];
  }

}
