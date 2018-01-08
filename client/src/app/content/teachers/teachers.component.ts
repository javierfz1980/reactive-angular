import {Component} from "@angular/core";
import {AuthService} from "../../commons/services/auth.service";
import {Teacher} from "../../commons/models/teacher";
import {globalProperties} from "../../../environments/properties";
import {Student} from "../../commons/models/student";
import {Observable} from "rxjs/Observable";
import {ContentService} from "../../commons/services/content.service";

@Component({
  selector: "gl-profesores",
  templateUrl: "./teachers.component.html"
})
export class TeachersComponent {

  teachers: Observable<Teacher[]>;
  title: string = "All Teachers";
  isAdministrator: Observable<boolean>;

  constructor(private authService: AuthService,
              private contentService: ContentService) {}

  ngOnInit() {

    this.teachers = this.contentService
      .getContent<Teacher[]>(globalProperties.teachersPath)
      .catch(error => Observable.throw(error));

    this.isAdministrator = this.authService.isAdministrator();

  }

  onDetails(entity: Teacher) {
    console.log("view details of: ", entity);
  }

  onEdit(entity: Teacher) {
    console.log("edit details of: ", entity);
  }

  onDelete(entity: Teacher) {
    console.log("delte: ", entity);
  }
}
