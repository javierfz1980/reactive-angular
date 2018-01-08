import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../commons/models/student";
import {ContentService} from "../../commons/services/content.service";
import {globalProperties} from "../../../environments/properties";
import {AuthService} from "../../commons/services/auth.service";

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
    console.log("students here");
  }

  onDetails(entity: Student) {
    console.log("view details of: ", entity);
  }

  onEdit(entity: Student) {
    console.log("edit details of: ", entity);
  }

  onDelete(entity: Student) {
    console.log("delete: ", entity);
  }

}
