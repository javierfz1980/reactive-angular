import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import {Student} from "../../common/models/student";
import {ContentService} from "../../common/services/content.service";
import {globalProperties} from "../../../environments/properties";
import {AuthService} from "../../common/services/auth.service";

@Component({
  selector: "gl-alumnos",
  templateUrl: "./students.component.html"
})
export class StudentsComponent implements OnInit {

  students: Observable<Student[]>;
  title: string = "All Students";
  isAdministrator: Observable<boolean>;

  constructor(private contentService: ContentService,
              private authService: AuthService) {}

  ngOnInit() {

    this.students = this.contentService
      .getContent<Student[]>(globalProperties.studentsPath)
      .catch(error => Observable.throw(error));

    this.isAdministrator = this.authService.isAdministrator();
  }

  onDetails(entity: Student) {
    console.log("view details of: ", entity);
  }

  onEdit(entity: Student) {
    console.log("edit details of: ", entity);
  }

  onDelete(entity: Student) {
    console.log("delte: ", entity);
  }

}
