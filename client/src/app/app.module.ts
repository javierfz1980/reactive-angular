import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {AlertsComponent} from './alerts/alerts.component';
import {SideNavComponent} from './nav/side-nav/side-nav.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {ServicesModule} from "./common/services/services.module";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ContentModule} from "./content/content.module";
import {ClarityModule} from "clarity-angular";
import {GuardModule} from "./common/guards/guard.module";
import {PipesModule} from "./common/pipes/pipes.module";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AppI18nModule} from "./app-i18n.module";

@NgModule({
  declarations: [
    SideNavComponent,
    AlertsComponent,
    HeaderComponent,
    AppComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ClarityModule,
    ContentModule,
    BrowserModule,
    AppRoutingModule,
    PipesModule,
    AppI18nModule.forRoot(),
    GuardModule.forRoot(),
    ServicesModule.forRoot(),
  ],
  providers: [
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
