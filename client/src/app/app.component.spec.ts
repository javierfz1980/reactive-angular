import {TestBed, async, ComponentFixture} from "@angular/core/testing";

import { AppComponent } from "./app.component";
import {Http} from "@angular/http";
import {CommonsModule} from "./commons/commons.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CoreModule} from "./core/core.module";
import {BrowserModule} from "@angular/platform-browser";
import {HttpLoaderFactory} from "./app.module";
import {DashboardModule} from "./content/dashboard/dashboard.module";
import {RouterTestingModule} from "@angular/router/testing";

describe('AppComponent', () => {

  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        CommonsModule,
        DashboardModule,
        CoreModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;

  }));

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

});
