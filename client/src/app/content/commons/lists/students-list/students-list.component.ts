import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../app-routing.module";
import {ContentService} from "../../../../core/providers/services/content/content.service";
import {BasicList} from "../../abstarct-clases/basic-list";
import {StoreData} from "../../../../models/core/store-data";

@Component({
  selector: "gl-students-list",
  templateUrl: "./students-list.component.html",
  styleUrls: ["./students-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentsListComponent extends BasicList<Student>{

  dataSource: Observable<StoreData<Student>>;

  constructor(private router: Router,
              protected contentService: ContentService) {
    super(contentService);
  }

  gotoStudent(id: string) {
    this.router.navigate([appRoutePaths.students.path, id])
  }


}
