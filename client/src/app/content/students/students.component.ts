import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import {Student} from "../../common/models/student";
import {ContentService} from "../../common/services/content.service";
import {globalProperties} from "../../../environments/properties";

@Component({
  selector: "gl-alumnos",
  templateUrl: "./students.component.html"
})
export class StudentsComponent implements OnInit {

  students: Observable<Student[]>;
  title: string = "All Students";

  constructor(private contentService: ContentService) {}

  ngOnInit() {

    this.students = this.contentService
      .getContent<Student[]>(globalProperties.studentsPath)
      .catch(error => Observable.throw(error));
  }

}
