import {Component, Input} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../app-routing.module";
import {ContentService} from "../../../../core/providers/services/content/content.service";

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
    this._isReadOnly = value;
    this.contentService.fetchStudents();
  }

  students: Observable<Student[]>;
  selectedStudents: Student[] = [];
  gridSize: number = 50;
  maxSize: number = this.gridSize;
  private _isReadOnly: boolean;

  constructor(private contentService: ContentService,
              private router: Router) {}

  ngOnInit() {
    this.students = this.contentService
      .getStudents()
      .map((students: Student[]) => {
        this.selectedStudents = students
          .filter((student: Student) => this.markedStudents && this.markedStudents
            .some((markedStudentId: string) => markedStudentId === student.id)
          );
        if (this._isReadOnly) {
          const res: Student[] = this.selectedStudents.slice();
          this.selectedStudents = null;
          this.maxSize = res.length;
          return res
        } else {
          this.maxSize = students.length;
          return students
        }
      });
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
