import {NgModule} from "@angular/core";
import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";
import {globalProperties} from "../../../environments/properties";
import {Http} from "@angular/http";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateStaticLoader(http, globalProperties.localesPath, '.json');
}

@NgModule()
export class AppI18nModule {

  static forRoot() {
    return TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [Http]
    })
  }

}
