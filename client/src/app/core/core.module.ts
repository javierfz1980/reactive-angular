import {ModuleWithProviders, NgModule} from "@angular/core";
import {NotificationsComponent} from "./components/notifications/notifications.component";
import {HeaderComponent} from "./components/header/header.component";
import {LoginComponent} from "./components/login/login.component";
import {SideNavComponent} from "./components/nav/side-nav/side-nav.component";
import {CommonsModule} from "../commons/commons.module";
import {ServicesModule} from "./providers/services/services.module";
import {InterceptorsModule} from "./providers/interceptors/interceptors.module";
import {GuardModule} from "./providers/guards/guard.module";
import {AccountComponent} from "./components/header/account/account.component";
import {AccountDetailsModalComponent} from "./components/header/account/account-details-modal/account-details-modal.component";
import {SearchComponent} from "./components/header/search/search.component";
import {NotificationComponent} from "./components/notifications/notification/notification.component";
import {AlertsComponent} from "./components/header/alerts/alerts.component";
import {AlertsModalComponent} from "./components/header/alerts/alerts-modal/alerts-modal.component";

const elements = [
  SideNavComponent,
  NotificationsComponent,
  HeaderComponent,
  LoginComponent,
  AccountComponent,
  AccountDetailsModalComponent,
  SearchComponent,
  NotificationComponent,
  NotificationsComponent,
  AlertsComponent,
  AlertsModalComponent
];

@NgModule({
  declarations: [
    ...elements
  ],
  imports: [
    CommonsModule,
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
