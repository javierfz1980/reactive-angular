import {Component, OnInit} from "@angular/core";
import {AuthService} from "./core/providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {TranslateService} from "ng2-translate";
import {globalProperties} from "../environments/properties";

@Component({
  selector: 'gl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isAuthorized: Observable<boolean>;

  constructor(private authService: AuthService,
              private translateService: TranslateService) {

    this.translateService.setDefaultLang(globalProperties.locale);
    this.translateService.use(globalProperties.locale);
  }

  ngOnInit() {
    this.isAuthorized = this.authService
      .authEmitter
      .asObservable();
  }
}
