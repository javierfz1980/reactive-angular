import {NgModule} from "@angular/core";
import {AlertsComponent} from "./components/alerts/alerts.component";
import {HeaderComponent} from "./components/header/header.component";
import {LoginComponent} from "./components/login/login.component";
import {SideNavComponent} from "./components/nav/side-nav/side-nav.component";
import {CommonsModule} from "../commons/commons.module";
import {ServicesModule} from "./providers/services/services.module";
import {InterceptorsModule} from "./providers/interceptors/interceptors.module";
import {AppI18nModule} from "./i18n/app-i18n.module";
import {GuardModule} from "./providers/guards/guard.module";

const elements = [
  SideNavComponent,
  AlertsComponent,
  HeaderComponent,
  LoginComponent,
];

@NgModule({
  declarations: [
    ...elements
  ],
  imports: [
    CommonsModule,
    GuardModule.forRoot(),
    ServicesModule.forRoot(),
    InterceptorsModule.forRoot(),
    AppI18nModule.forRoot(),
  ],
  exports: [
    ...elements
  ]
})
export class CoreModule {}
