import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {StudentInfo} from "../../../models/student";
import {Observable} from "rxjs/Observable";
import {
  ContentAlert
} from "../../commons/alert/content-alert.component";
import {AuthService} from "../../../core/providers/services/auth.service";
import {StudentsService} from "../../../core/providers/services/content/students.service";
import 'rxjs/add/observable/throw';
import {InfoProfileData} from "../../commons/info-form/info-form.component";

@Component({
  selector: "gl-single-student",
  templateUrl: "./single-student.component.html"
})
export class SingleStudentComponent implements OnInit {

  alert: ContentAlert;
  info: Observable<StudentInfo>;
  isAdministrator: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private studentsService: StudentsService) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
    this.fetchContent();
  }

  fetchContent() {
    this.info = this.route.params
      .map((params: Params) => params.id)
      .switchMap((id:string) => this.studentsService.getStudentInfo(id))
      .catch((error: any) => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      })
      .do((finalData: StudentInfo) => console.log("final data: ", finalData));
  }

  delete(data: InfoProfileData) {
    console.log("delete: ", data);
  }

  update(data: InfoProfileData) {
    console.log("update: ", data);
  }
}
