import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {CoreModule} from "../../../core/core.module";
import {CourseCardComponent} from "./course-card.component";
import {
  mockedCourses, mockedTeachers,
} from "../../../core/providers/services/mock/mock-content.service";
import {CommonsModule} from "../../../commons/commons.module";

describe("CoursesCardComponent", () => {

  let component: CourseCardComponent;
  let fixture: ComponentFixture<CourseCardComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CourseCardComponent,
      ],
      imports: [
        CommonsModule,
        CoreModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCardComponent);

    component = fixture.debugElement.componentInstance;
    component.course = mockedCourses[0];
    component.course.teacherInfo = mockedTeachers[0];

    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    spyOn(component.viewEvent, 'emit');

  }));

  it("it shows the title and body capitalized", () => {
    // "Title" and "Body" strings are based on the mock Posts returned by the mocked MockPostService
    const expectedCapitalizedTtitle: string = "Title 1";
    const expectedCapitalizedBody: string = "Detail 1";
    expect(compiled.querySelector('.card-header').textContent).toContain(expectedCapitalizedTtitle);
    expect(compiled.querySelector('.card-text').textContent).toContain(expectedCapitalizedBody);
  });

  it("it navigates to the correct single post id", () => {
    compiled.querySelector('.btn-view').click();
    expect(component.viewEvent.emit).toHaveBeenCalledWith(component.course);
  });

});
