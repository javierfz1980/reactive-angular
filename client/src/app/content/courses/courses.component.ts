import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import {Course} from "../../commons/models/course";
import {ContentService} from "../../commons/services/content.service";
import {globalProperties} from "../../../environments/properties";

@Component({
  selector: "gl-cursos",
  templateUrl: "./courses.component.html"
})
export class CoursesComponent implements OnInit {

  courses: Observable<Course[]>;
  title = "All Courses";

  constructor(private contentService: ContentService) {}

  ngOnInit() {

    this.courses = this.contentService
      .getContent<Course[]>(globalProperties.coursesPath)
      .catch(error => Observable.throw(error))


      /*.select("entities", "courses")
      .filter(courses => courses !== undefined)
      .do(state => console.log("courses state: ", state));*/

  }
}
