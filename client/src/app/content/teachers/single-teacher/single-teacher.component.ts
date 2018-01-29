import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../../core/providers/services/auth.service";
import {Observable} from "rxjs/Observable";
import {
  ConfirmationModalComponent
} from "../../../commons/confirmation-modal/confirmation-modal.component";
import {Teacher} from "../../../models/content/teacher";
import {
  InfoProfileData,
  InfoProfileFormComponent
} from "../../commons/forms/info/info-profile/info-profile-form.component";
import {appRoutePaths} from "../../../app-routing.module";
import {ContentService} from "../../../core/providers/services/content/content.service";
import 'rxjs/add/operator/takeWhile';
import {Course} from "../../../models/content/course";
import {BasicInfoList} from "../../commons/abstarct-clases/basic-info-list";

@Component({
  selector: "gl-single-teacher",
  templateUrl: "./single-teacher.component.html"
})
export class SingleTeacherComponent extends BasicInfoList<InfoProfileData, InfoProfileFormComponent, Course>
                                    implements OnInit, OnDestroy {

  @ViewChild("confirmModal")
  confirmModal: ConfirmationModalComponent;

  @ViewChild("infoForm")
  infoForm: InfoProfileFormComponent;

  action: () => void;
  private isAlive: boolean = true;

  constructor(private router: Router,
              private contentService: ContentService,
              protected authService: AuthService,
              protected route: ActivatedRoute) {
    super(authService, route);
  }

  ngOnInit() {
    super.ngOnInit();

    this.id = this.route.params
      .map((params: Params) => {
        this.contentService.fetchTeachers(params.id);
        return params.id
      });

    this.source = this.contentService
      .getTeachers()
      .filter(storeData => Boolean(storeData.data))
      .withLatestFrom(this.id)
      .map(([storeData, id]) => storeData.data.find((teacher: Teacher) => teacher.id === id))
      .filter((teacher: Teacher) => Boolean(teacher))
      .switchMap((teacher: Teacher) =>{
        return Observable.forkJoin(
          this.contentService.getProfile(teacher.profile_id),
          this.contentService.getAllCoursesOfTeacher(teacher.id))
          .map(([profile, courses]) => {
            teacher.courses = courses;
            return ({info: teacher, profile: profile});
          })
      });

    this.listFormSource = this.contentService
      .getActiveCoursesWithTeacher();

    this.listFormMarked = this.source
      .map((data: InfoProfileData) => data.info)
      .map((teacher: Teacher) => teacher.courses);
  }

  delete(data: Teacher) {
    this.action = () => {
      this.modalData.title = "Deleting";
      this.modalData.isBusy = true;
      this.contentService
        .deleteTeacher(data)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
            this.router.navigate([appRoutePaths.teachers.path]);
          });
    };
    super.openDeleteConfirmation();
  }

  update(data: InfoProfileData) {
    this.action = () => {
      this.modalData.title = "Updating";
      this.modalData.isBusy = true;
      this.contentService
        .updateTeacher(data.info, data.profile, this.elementsTobeRemoved, this.elementsTobeAdded)
        .takeWhile(() => this.isAlive)
        .subscribe(
          () => {
            this.modalData.isBusy = false;
            this.confirmModal.close();
          });
    };
    super.openUpdateConfirmation(data.info.courses, this.infoForm.listForm.getSelecteds())
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
