import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Course} from "../../../../models/content/course";
import {TeachersService} from "../../../../core/providers/services/content/teachers.service";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../models/content/teacher";

export type CourseInfoType = "create" | "update";

@Component({
  selector: "gl-course-info",
  templateUrl: "./course-info.component.html",
  styleUrls: ["./course-info.component.css"]
})
export class CourseInfoComponent implements OnInit{

  @Input()
  info: Course;

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

  @Output('update')
  updateEvent: EventEmitter<Course> = new EventEmitter<Course>();

  @Output('create')
  createEvent: EventEmitter<Course> = new EventEmitter<Course>();

  _isReadOnly: boolean;
  form: FormGroup;
  teachersList: Observable<Teacher[]>

  private type: CourseInfoType;

  constructor(private fb: FormBuilder,
              private teachersService: TeachersService) {}

  ngOnInit() {

    this.teachersList = this.teachersService
      .getTeachers();

    this.type = this.info ? "update" : "create";
    // validate info received or make an empty info for use it as an input form. (new registers)
    this.info = this.validateInfo();

    this.form = this.fb.group({
      id: [this.info.id ],
      title: [this.info.title, Validators.required ],
      short_description: [this.info.short_description, Validators.required ],
      detail: [this.info.detail, Validators.required ],
      active: [{value: this.info.active, disabled: this._isReadOnly}, Validators.required ],
      teacher: [{value: this.info.teacher, disabled: this._isReadOnly}, Validators.required ]
    });

  }

  private validateInfo(): Course {
    if (!this.info) {
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
    return this.info;
  }

  update() {
    this.updateEvent.emit(this.form.value);
  }

  create() {
    this.createEvent.emit(this.form.value);
  }

}
