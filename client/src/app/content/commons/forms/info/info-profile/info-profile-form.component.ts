import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Profile} from "../../../../../models/content/profile";
import {BasicInfo} from "../../../../../models/content/basic-info";
import {BasicInfoForm} from "../../../abstarct-clases/basic-info-form";
import {getDateString} from "../../../../../helpers/helpers";
import {AuthService} from "../../../../../core/providers/services/auth.service";
import {StoreData} from "../../../../../models/core/store-data";
import {Observable} from "rxjs/Observable";
import {StudentsListFormComponent} from "../../lists/students-list/students-list-form.component";
import {Student} from "../../../../../models/content/student";

export interface InfoProfileData {
  info: BasicInfo;
  profile: Profile;
  courses?: string[];
}

@Component({
  selector: "gl-info-profile-form",
  templateUrl: "./info-profile-form.component.html",
  styleUrls: ["./info-profile-form.component.css"]
})
export class InfoProfileFormComponent extends BasicInfoForm<InfoProfileData> implements OnInit {

  @ViewChild("listForm")
  listForm: StudentsListFormComponent;

  @Input()
  markedList: Observable<string[]>;

  @Input()
  editMode: Observable<boolean>;

  @Input()
  sourceList: Observable<StoreData<Student>>;

  @Input()
  set info(data: InfoProfileData) {
    this._info = data;
    if (this.form) {
      this.form.reset();
      data.profile.birthday = getDateString(data.profile.birthday);
      this.form.controls["info"].patchValue(data.info);
      this.form.controls["profile"].patchValue(data.profile);
    }
  };

  private info_group: FormGroup;
  private profile_group: FormGroup;

  constructor(private fb: FormBuilder,
              protected authService: AuthService) {
    super(authService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.info = this.validateInfo();

    this.info_group = this.fb.group({
      id: [this._info.info.id ],
      first_name: [this._info.info.first_name, Validators.required ],
      last_name: [this._info.info.last_name, Validators.required ],
      email: [this._info.info.email, [Validators.required, Validators.email] ],
      profile_id: [this._info.info.profile_id ],
      courses: [this._info.info.courses ]
    });

    this.profile_group = this.fb.group({
      id: [this._info.profile.id ],
      birthday: [getDateString(this._info.profile.birthday), Validators.required ],
      avatar: [this._info.profile.avatar],
      secondary_email: [this._info.profile.secondary_email],
      contact: this.fb.group({
        street: [this._info.profile.contact.street ,Validators.required],
        state: [this._info.profile.contact.state ,Validators.required],
        country: [this._info.profile.contact.country ,Validators.required],
        city: [this._info.profile.contact.city ,Validators.required],
        zip: [this._info.profile.contact.zip ,Validators.required],
        phone: [this._info.profile.contact.phone ,Validators.required],
      }),
    });

    this.form = this.fb.group({
      info: this.info_group,
      profile: this.profile_group
    })
  }

  private validateInfo(): InfoProfileData{
    if (!this._info) {
        return {
          info: {id: "", first_name: "", last_name: "", email: "", profile_id: "", courses: []},
          profile: {id: "", birthday: "", avatar: "", secondary_email: "", contact:
              {street: "", state: "", country: "", city: "", zip: "", phone: ""}
        }
      }
    }
    return this._info;
  }

}
