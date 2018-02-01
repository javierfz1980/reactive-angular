import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {SearchService} from "../../../providers/services/search.service";
import {StoreData} from "../../../../models/core/store-data";
import {Teacher} from "../../../../models/content/teacher";
import {Student} from "../../../../models/content/student";
import {Course} from "../../../../models/content/course";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {appRoutePaths} from "../../../../app-routes";


@Component({
  selector: "gl-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {

  @ViewChild("search_input")
  search_input: ElementRef;

  input: Observable<string>;
  studentsResults: Observable<StoreData<Student>>;
  teachersResults: Observable<StoreData<Teacher>>;
  coursesResults: Observable<StoreData<Course>>;
  displayResults: boolean = false;

  constructor(private searchService: SearchService,
              private router: Router) {}

  ngOnInit() {
    this.input = Observable.fromEvent(this.search_input.nativeElement, "keyup")
      .debounceTime(200)
      .map((event: KeyboardEvent) => event.target['value'])
      .distinctUntilChanged();

    this.studentsResults = this.input
      .switchMap((data: string) => this.searchService.searchStudents(data));

    this.teachersResults = this.input
      .switchMap((data: string) => this.searchService.searchTeachers(data));

    this.coursesResults = this.input
      .switchMap((data: string) => this.searchService.searchCourses(data));

  }

  mouseOver() {
    this.showResults();
  }

  mouseLeave() {
   this.hideResults();
  }

  gotoStudent(data: Student) {
    this.hideResults();
    this.router.navigate([appRoutePaths.students.path, data.id]);
  }

  gotoTeacher(data: Teacher) {
    this.hideResults();
    this.router.navigate([appRoutePaths.teachers.path, data.id]);
  }

  gotoCourse(data: Course) {
    this.hideResults();
    this.router.navigate([appRoutePaths.courses.path, data.id]);
  }

  private hideResults() {
    this.search_input.nativeElement["value"] = "";
    this.search_input.nativeElement.blur();
    this.displayResults = false;
  }

  private showResults() {
    this.displayResults = true;
  }

}
