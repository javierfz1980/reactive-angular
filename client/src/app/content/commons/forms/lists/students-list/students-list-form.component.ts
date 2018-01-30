import {Component} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../../models/content/student";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../../app-routing.module";
import {ContentService} from "../../../../../core/providers/services/content/content.service";
import {BasicListForm} from "../../../abstarct-clases/basic-list-form";
import {StoreData} from "../../../../../models/core/store-data";

@Component({
  selector: "gl-students-list-form",
  templateUrl: "./students-list-form.component.html",
  styleUrls: ["./students-list-form.component.css"]
})
export class StudentsListFormComponent extends BasicListForm<Student>{

  dataSource: Observable<StoreData<Student>>;
  gridSize: number = 10;
  initialGridSize: number = this.gridSize;
  maxSize: number = this.gridSize;

  constructor(private contentService: ContentService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.dataSource = this.stream
      .map(([storeData, marked, editMode]) => {
        if (!storeData.data) storeData.data = [];
        this.selection = storeData.data
          .filter((student: Student) => marked && marked
            .some((markedStudentId: string) => markedStudentId === student.id)
          );
        this.gridSize = this.initialGridSize;
        if (editMode) {
          this.setMaxSize(storeData.data.length);
          this.changeGridSize(storeData.data.length > this.gridSize ? this.gridSize : storeData.data.length);
          return storeData;
        }
        const res: Student[] = this.selection.slice();
        this.selection = null;
        this.setMaxSize(res.length);
        this.changeGridSize(res.length > this.gridSize ? this.gridSize : res.length);
        return {data: res, loading: storeData.loading};
      });

    this.contentService.fetchStudents();
  }

  gotoStudent(id: string) {
    this.router.navigate([appRoutePaths.students.path, id])
  }



  changeGridSize(value?: number) {
    this.gridSize = value ? value : this.maxSize;
  }

  private setMaxSize(value: number) {
    this.maxSize = value > 0 ? value : this.gridSize;
  }

}
