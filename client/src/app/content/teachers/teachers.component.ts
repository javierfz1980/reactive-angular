import {Component} from "@angular/core";
import {AuthService} from "../../common/services/auth.service";
import {Teacher} from "../../common/models/teacher";
import {globalProperties} from "../../../environments/properties";
import {Student} from "../../common/models/student";
import {Observable} from "rxjs/Observable";
import {ContentService} from "../../common/services/content.service";

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
