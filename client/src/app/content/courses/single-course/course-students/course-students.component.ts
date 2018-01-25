import {Component, Input} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../app-routing.module";
import {ContentService} from "../../../../core/providers/services/content/content.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: "gl-course-students",
  templateUrl: "./course-students.component.html",
  styleUrls: ["./course-students.component.css"]
})
export class CourseStudentsComponent {

  @Input()
  markedStudents: string[] = [];

  @Input()
  set isReadOnly(value: boolean) {
    this.readonlyEmitter.next(value);
  }

  students: Observable<Student[]>;
  selectedStudents: Student[] = [];
  gridSize: number = 50;
  maxSize: number = this.gridSize;
  private readonlyEmitter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readOnlyValue: Observable<boolean> = this.readonlyEmitter.asObservable();

  constructor(private contentService: ContentService,
              private router: Router) {}

  ngOnInit() {
    this.students = this.readOnlyValue
      .combineLatest(
        this.contentService
        .getStudents()
        .filter(data => data !== undefined))
      .map(([isReadOnly, students]) => {
        this.selectedStudents = students
          .filter((student: Student) => this.markedStudents && this.markedStudents
            .some((markedStudentId: string) => markedStudentId === student.id)
          );
        if (isReadOnly) {
          const res: Student[] = this.selectedStudents.slice();
          this.selectedStudents = null;
          this.maxSize = res.length;
          return res
        } else {
          this.maxSize = students.length;
          return students
        }
      });

    this.contentService.fetchStudents();
  }

  gotoStudent(id: string) {
    this.router.navigate([appRoutePaths.students.path, id])
  }

  changeGridSize(value?: number) {
    this.gridSize = value ? value : this.maxSize;
  }

  getSelectedStudents(): string[] {
    return this.selectedStudents
      .map((student: Student) => student.id);
  }
}
