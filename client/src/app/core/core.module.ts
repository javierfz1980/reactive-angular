import {ModuleWithProviders, NgModule} from "@angular/core";
import {AlertsComponent} from "./components/alerts/alerts.component";
import {HeaderComponent} from "./components/header/header.component";
import {LoginComponent} from "./components/login/login.component";
import {SideNavComponent} from "./components/nav/side-nav/side-nav.component";
import {CommonsModule} from "../commons/commons.module";
import {ServicesModule} from "./providers/services/services.module";
import {interceptors, InterceptorsModule} from "./providers/interceptors/interceptors.module";
import {AppI18nModule} from "./i18n/app-i18n.module";
import {GuardModule} from "./providers/guards/guard.module";
import {AccountComponent} from "./components/header/account/account.component";
import {AccountDetailsModalComponent} from "./components/header/account/account-details-modal/account-details-modal.component";
import {SearchComponent} from "./components/header/search/search.component";
import {AlertComponent} from "./components/alerts/alert/alert.component";

const elements = [
  SideNavComponent,
  AlertsComponent,
  HeaderComponent,
  LoginComponent,
  AccountComponent,
  AccountDetailsModalComponent,
  SearchComponent,
  AlertComponent,
  AlertsComponent,
];

@NgModule({
  declarations: [
    ...elements
  ],
  imports: [
    CommonsModule,
    AppI18nModule.forRoot(),
  ],
  exports: [
    ...elements,
  ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        ServicesModule.forCore(),
        GuardModule.forCore(),
        InterceptorsModule.forCore(),
      ]
    };
  }

}
