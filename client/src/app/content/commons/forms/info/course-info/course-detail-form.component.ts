import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Course} from "../../../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../../models/content/teacher";
import {AuthService} from "../../../../../core/providers/services/auth.service";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../../app-routing.module";
import {ContentService} from "../../../../../core/providers/services/content/content.service";
import {BasicInfoForm} from "../../../abstarct-clases/basic-info-form";
import {InfoProfileData} from "../info-profile/info-profile-form.component";

@Component({
  selector: "gl-course-detail-form",
  templateUrl: "./course-detail-form.component.html",
  styleUrls: ["./course-detail-form.component.css"]
})
export class CourseDetailFormComponent extends BasicInfoForm<Course> implements OnInit{

  @Input()
  data: Course;

  @Input()
  set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    if (this.form) {
      if (value) {
        this.form.controls["teacher"].disable();
        this.form.controls["active"].disable();
      } else {
        this.form.controls["teacher"].enable();
        this.form.controls["active"].enable();
      }
    }
  };

  _isReadOnly: boolean;
  isAdministrator: boolean;
  teachersList: Observable<Teacher[]>;

  constructor(private fb: FormBuilder,
              private contentService: ContentService,
              private authService: AuthService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    console.log(this.type)
    this.data = this.validateInfo();
    this.isAdministrator = this.authService.isAdministrator();
    this.teachersList = this.contentService
      .getTeachers()
      .merge(Observable.of([]));

    this.form = this.fb.group({
      id: [this.data.id ],
      title: [this.data.title, Validators.required ],
      short_description: [this.data.short_description, Validators.required ],
      detail: [this.data.detail, Validators.required ],
      active: [{value: this.data.active, disabled: this._isReadOnly}, Validators.required ],
      teacher: [{value: this.data.teacher, disabled: this._isReadOnly}, Validators.required ],
      students: [this.data.students ]
    });

    this.contentService.fetchTeachers();
  }

  private validateInfo(): Course {
    if (!this.data) {
      return {
        id: "",
        title: "",
        short_description: "",
        detail: "",
        active: false,
        teacher: "",
        students: []
      }
    }
    return this.data;
  }

  gotoTeacher(edit: boolean = false) {
    const queryParams = edit ? {queryParams: { edit: true}} : {};
    this.router.navigate([appRoutePaths.teachers.path, this.form.controls["teacher"].value], queryParams);
  }

}
