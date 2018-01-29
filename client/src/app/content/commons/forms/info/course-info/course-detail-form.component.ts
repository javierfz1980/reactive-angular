import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Course} from "../../../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../../models/content/teacher";
import {AuthService} from "../../../../../core/providers/services/auth.service";
import {Router} from "@angular/router";
import {appRoutePaths} from "../../../../../app-routing.module";
import {ContentService} from "../../../../../core/providers/services/content/content.service";
import {BasicInfoForm} from "../../../abstarct-clases/basic-info-form";
import {StoreData} from "../../../../../models/core/store-data";
import {Student} from "../../../../../models/content/student";
import {StudentsListFormComponent} from "../../lists/students-list/students-list-form.component";

@Component({
  selector: "gl-course-detail-form",
  templateUrl: "./course-detail-form.component.html",
  styleUrls: ["./course-detail-form.component.css"]
})
export class CourseDetailFormComponent extends BasicInfoForm<Course> implements OnInit{

  @ViewChild("listForm")
  listForm: StudentsListFormComponent;

  @Input()
  markedList: Observable<string[]>;

  @Input()
  editMode: Observable<boolean>;

  @Input()
  sourceList: Observable<StoreData<Student>>;

  @Input()
  set info(data: Course) {
    this.data = data;
    if (this.form) {
      this.form.reset();
      this.form.patchValue(data);
    }
    this.contentService.fetchTeachers();
  };

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

  selectTeacherStr: string = "Select a Teacher";
  teachersDataSource: Observable<StoreData<Teacher>>;

  constructor(private fb: FormBuilder,
              private contentService: ContentService,
              private router: Router,
              protected authService: AuthService) {
    super(authService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.data = this.validateInfo();

    console.log(this.data.teacher)

    this.teachersDataSource = this.contentService
      .getTeachers();

    this.form = this.fb.group({
      id: [this.data.id ],
      title: [this.data.title, Validators.required ],
      short_description: [this.data.short_description, Validators.required ],
      detail: [this.data.detail, Validators.required ],
      active: [{value: this.data.active, disabled: this._isReadOnly}, Validators.required ],
      teacher: [{value: this.data.teacher, disabled: this._isReadOnly} ],
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
