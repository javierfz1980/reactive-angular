import {HeaderComponent} from "./header.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";

describe("HeaderComponent", () => {

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    compiled = fixture.debugElement.nativeElement;

  }));

  it(`should have 'gl' on the title `, async(() => {
    expect(component.headerTitle.indexOf("gl")).toBeGreaterThan(0);
  }));

  it(`should render the brand inside a '.branding' css class selector`, async(() => {
    const brand: string = component.headerTitle;
    expect(compiled.querySelector('.branding').textContent).toContain(brand);
  }));

})
