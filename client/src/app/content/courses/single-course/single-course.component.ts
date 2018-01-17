import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ContentAlert} from "../../commons/alert/content-alert.component";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Subscription} from "rxjs/Subscription";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../../commons/confirmation-modal/confirmation-modal.component";
import {Course} from "../../../models/content/course";
import {InfoProfileData} from "../../commons/info-form/info-form.component";
import {CoursesService} from "../../../core/providers/services/content/courses.service";

@Component({
  selector: "gl-single-course",
  templateUrl: "./single-course.component.html"
})
export class SingleCourseComponent {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  // @ViewChild("students")
  // students: CoursesFormComponent;

  alert: ContentAlert;
  info: Observable<Course>;
  isAdministrator: boolean;
  modalData: ConfirmationData;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private coursesService: CoursesService) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
    this.fetchContent();
  }

  fetchContent() {
    /*this.info = this.route.params
      .map((params: Params) => params.id)
      .switchMap((id:string) => this.studentsService.getStudentInfo(id))
      .catch((error: any) => {
        this.alert = {type: "danger", message: error.message};
        return Observable.throw(error)
      })
      .do((finalData: InfoProfileData) => console.log("final data single course: ", finalData));*/
  }
}

/*
{
>     "id": UUID,
>     "title": String,
>     "short_description": String,
>     "detail": String,
>     "active": Boolean,
>     "teacher": UUID,
>     "students": [
>       UUID,
>       ...
>     ]
>  }*/
