import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClient} from "@angular/common/http";
import {CommonsModule} from "./commons/commons.module";
import {BrowserModule} from "@angular/platform-browser";
import {CoreModule} from "./core/core.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DashboardModule} from "./content/dashboard/dashboard.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {globalProperties} from "../environments/properties";
import {TranslateStaticLoader} from "ng2-translate";
import {Http} from "@angular/http";

export function HttpLoaderFactory(http: Http) {
  return new TranslateStaticLoader(http, globalProperties.localesPath, '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonsModule,
    DashboardModule,
    CoreModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    })
  ],
  providers: [
    HttpClient,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
