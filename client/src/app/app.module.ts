import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {AlertsComponent} from './alerts/alerts.component';
import {SideNavComponent} from './nav/side-nav/side-nav.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardComponent} from './content/dashboard/dashboard.component';
import {ServicesModule} from "./common/services/services.module";
import {HttpClient} from "@angular/common/http";
import {ContentModule} from "./content/content.module";

@NgModule({
  declarations: [
    LoginComponent,
    SideNavComponent,
    AlertsComponent,
    HeaderComponent,
    AppComponent
  ],
  imports: [
    ContentModule,
    BrowserModule,
    AppRoutingModule,
    ServicesModule.forRoot()
  ],
  providers: [
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
