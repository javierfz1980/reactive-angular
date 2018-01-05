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

@NgModule({
  declarations: [
    LoginComponent,
    SideNavComponent,
    AlertsComponent,
    HeaderComponent,
    AppComponent
  ],
  imports: [
    HttpClientModule,
    ClarityModule,
    ContentModule,
    BrowserModule,
    AppRoutingModule,
    ServicesModule.forRoot(),
    GuardModule.forRoot(),
  ],
  providers: [
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
