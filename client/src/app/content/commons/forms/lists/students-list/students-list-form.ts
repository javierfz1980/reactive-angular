import {Component} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../../models/content/student";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../../app-routing.module";
import {ContentService} from "../../../../../core/providers/services/content/content.service";
import {BasicListFormComponent} from "../basic-list-form.component";

@Component({
  selector: "gl-students-list-form",
  templateUrl: "./students-list-form.html",
  styleUrls: ["./students-list-form.css"]
})
export class StudentsListForm extends BasicListFormComponent<Student>{

  students: Observable<Student[]>;
  gridSize: number = 50;
  maxSize: number = this.gridSize;

  constructor(private contentService: ContentService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.students = this.stream
      .map(([source, marked, edit]) => {
        this.selection = source
          .filter((student: Student) => marked && marked
            .some((markedStudentId: string) => markedStudentId === student.id)
          );
        if (edit) {
          this.maxSize = source.length;
          return source;
        }
        const res: Student[] = this.selection.slice();
        this.selection = null;
        this.maxSize = res.length;
        return res;
      });

    this.contentService.fetchStudents();
  }

  gotoStudent(id: string) {
    this.router.navigate([appRoutePaths.students.path, id])
  }

  changeGridSize(value?: number) {
    this.gridSize = value ? value : this.maxSize;
  }

}
