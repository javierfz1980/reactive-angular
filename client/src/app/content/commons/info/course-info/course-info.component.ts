import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Course} from "../../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../models/content/teacher";
import {AuthService} from "../../../../core/providers/services/auth.service";
import {Router} from "@angular/router";
import {ContentService} from "../../../../core/providers/services/content/content.service";
import {BasicInfo} from "../../abstarct-clases/basic-info";
import {StoreData} from "../../../../models/core/store-data";
import {Student} from "../../../../models/content/student";
import {StudentsListComponent} from "../../lists/students-list/students-list.component";
import {appRoutePaths} from "../../../../app-routes";

@Component({
  selector: "gl-course-info",
  templateUrl: "./course-info.component.html",
  styleUrls: ["./course-info.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseInfoComponent extends BasicInfo<Course> implements OnInit{

  @ViewChild("listForm")
  listForm: StudentsListComponent;

  @Input()
  markedList: Observable<string[]>;

  @Input()
  editMode: Observable<boolean>;

  @Input()
  sourceList: Observable<StoreData<Student>>;

  @Input()
  set info(data: Course) {
    this._info = data;
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

  teachersDataSource: Observable<StoreData<Teacher>>;

  constructor(private fb: FormBuilder,
              private contentService: ContentService,
              private router: Router,
              protected authService: AuthService) {
    super(authService);
  }

  ngOnInit() {
    super.ngOnInit();
    this._info = this.validateInfo();

    this.teachersDataSource = this.contentService
      .getTeachers()
      .merge(Observable.of({data:[], loading: true}));

    this.form = this.fb.group({
      id: [this._info.id ],
      title: [this._info.title, Validators.required ],
      short_description: [this._info.short_description, Validators.required ],
      detail: [this._info.detail, Validators.required ],
      active: [{value: this._info.active, disabled: this._isReadOnly}, Validators.required ],
      teacher: [{value: this._info.teacher, disabled: this._isReadOnly} ],
      students: [this._info.students ]
    });

    this.contentService.fetchTeachers();
  }

  private validateInfo(): Course {
    if (!this._info) {
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
    return this._info;
  }

  gotoTeacher(edit: boolean = false) {
    const queryParams = edit ? {queryParams: { edit: true}} : {};
    this.router.navigate([appRoutePaths.teachers.path, this.form.controls["teacher"].value], queryParams);
  }

}
