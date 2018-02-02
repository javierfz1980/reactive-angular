import {HeaderComponent} from "./header.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {CommonsModule} from "../../../commons/commons.module";
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserModule} from "@angular/platform-browser";
import {Component, ViewChild} from "@angular/core";
import {CoreModule} from "../../core.module";

describe("HeaderComponent", () => {

  @Component({
    selector: "gl-mock-wrapper",
    template: `<clr-main-container><gl-header #header></gl-header></clr-main-container>`
  })
  class MockWrapper {
    @ViewChild("header")
    header: HeaderComponent;
  }

  let component: MockWrapper;
  let fixture: ComponentFixture<MockWrapper>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockWrapper
      ],
      imports: [
        BrowserModule,
        CommonsModule,
        CoreModule.forRoot(),
        RouterTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MockWrapper);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    compiled = fixture.debugElement.nativeElement;

  }));

  it(`should have 'gl' on the title `, async(() => {
    expect(component.header.headerTitle.toLowerCase().indexOf("gl")).toBeGreaterThan(0);
  }));

  it(`should render the brand inside a '.branding' css class selector`, async(() => {
    const brand: string = component.header.headerTitle;
    expect(compiled.querySelector('.branding').textContent).toContain(brand);
  }));

});
