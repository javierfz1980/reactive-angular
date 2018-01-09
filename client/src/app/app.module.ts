import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClient} from "@angular/common/http";
import {CommonsModule} from "./commons/commons.module";
import {BrowserModule} from "@angular/platform-browser";
import {CoreModule} from "./core/core.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonsModule,
    CoreModule,
    AppRoutingModule,
  ],
  providers: [
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
