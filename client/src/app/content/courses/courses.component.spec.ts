import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {CoursesComponent} from "./courses.component";
import {CoursesModule} from "./courses.module";
import {ContentService} from "../../core/providers/services/content/content.service";
import {
  MockContentService,
} from "../../core/providers/services/mock/mock-content.service";
import {AuthService} from "../../core/providers/services/auth.service";
import {MockAuthService} from "../../core/providers/services/mock/mock.auth.service";

describe("CoursesComponent", () => {

  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let compiled;
  let autService: MockAuthService = new MockAuthService();

  function createComponent() {
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        RouterTestingModule,
        CoursesModule
      ],
      providers: [
        {provide: ContentService, useValue: new MockContentService()},
        {provide: AuthService, useValue: autService},
      ]
    }).compileComponents();

    createComponent();
  }));

  it("it has a title with the string 'All Courses' on an h1 tag", () => {
    const expectedTitle: string = component.title;
    expect(compiled.querySelector('h1').textContent).toContain(expectedTitle);
  });

  it("it shows at least one post-card", () => {
    expect(compiled.querySelector('gl-course-card')).toBeTruthy();
  });

  it("it hasn't to show the create Course button if is not an Administrator user", () => {
    autService.isAdmin = false;
    createComponent();
    expect(compiled.querySelector('.create-course')).toBeFalsy();
  });

});
