import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {AlertsComponent} from './alerts/alerts.component';
import {SideNavComponent} from './nav/side-nav/side-nav.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {ServicesModule} from "./commons/services/services.module";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ContentModule} from "./content/content.module";
import {ClarityModule} from "clarity-angular";
import {GuardModule} from "./commons/guards/guard.module";
import {PipesModule} from "./commons/pipes/pipes.module";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AppI18nModule} from "./app-i18n.module";
import {InterceptorsModule} from "./commons/interceptors/interceptors.module";
import {CommonsModule} from "./commons/commons.module";

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    AlertsComponent,
    HeaderComponent,
    LoginComponent,
  ],
  imports: [
    CommonsModule,
    AppRoutingModule,
    AppI18nModule.forRoot(),
  ],
  providers: [
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
