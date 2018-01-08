import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {AlertsComponent} from './alerts/alerts.component';
import {SideNavComponent} from './nav/side-nav/side-nav.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClient} from "@angular/common/http";
import {ContentModule} from "./content/content.module";
import {AppI18nModule} from "./app-i18n.module";
import {AppCommonsModule} from "./commons/app-commons.module";
import {BrowserModule} from "@angular/platform-browser";
import { GuardModule } from 'app/commons/guards/guard.module';
import { InterceptorsModule } from 'app/commons/interceptors/interceptors.module';
import { ServicesModule } from 'app/commons/services/services.module';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    AlertsComponent,
    HeaderComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppCommonsModule,
    AppRoutingModule,
    ContentModule,
    GuardModule.forRoot(),
    ServicesModule.forRoot(),
    InterceptorsModule.forRoot(),
    AppI18nModule.forRoot()
  ],
  providers: [
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
