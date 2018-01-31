import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfileBasicInfo} from "../../../../models/content/profile-basic-info";
import {BasicInfo} from "../../abstarct-clases/basic-info";
import {getDateString} from "../../../../helpers/helpers";
import {AuthService} from "../../../../core/providers/services/auth.service";
import {StoreData} from "../../../../models/core/store-data";
import {Observable} from "rxjs/Observable";
import {StudentsListComponent} from "../../lists/students-list/students-list.component";
import {Student} from "../../../../models/content/student";

@Component({
  selector: "gl-profile-info",
  templateUrl: "./profile-info.component.html",
  styleUrls: ["./profile-info.component.css"]
})
export class ProfileInfoComponent extends BasicInfo<ProfileBasicInfo> implements OnInit {

  @ViewChild("listForm")
  listForm: StudentsListComponent;

  @Input()
  markedList: Observable<string[]>;

  @Input()
  editMode: Observable<boolean>;

  @Input()
  sourceList: Observable<StoreData<Student>>;

  @Input()
  set info(data: ProfileBasicInfo) {
    this._info = data;

    if (this.form) {
      this.form.reset();
      data.profile.birthday = getDateString(data.profile.birthday);
      this.form.patchValue(data);
      this.form.controls["profile"].patchValue(data.profile);
    }

    console.log(data, this.form)
  };

  private profile_group: FormGroup;

  constructor(private fb: FormBuilder,
              protected authService: AuthService) {
    super(authService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.info = this.validateInfo();

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
      id: [this._info.id ],
      first_name: [this._info.first_name, Validators.required ],
      last_name: [this._info.last_name, Validators.required ],
      email: [this._info.email, [Validators.required, Validators.email] ],
      profile_id: [this._info.profile_id ],
      courses: [this._info.courses ],
      profile: this.profile_group
    });

    console.log(this.form)
  }

  private validateInfo(): ProfileBasicInfo{
    if (!this._info) {
        return {
          id: "", first_name: "", last_name: "", email: "", profile_id: "", courses: [],
          profile: {id: "", birthday: "", avatar: "", secondary_email: "", contact:
              {street: "", state: "", country: "", city: "", zip: "", phone: ""}
        }
      }
    }
    return this._info;
  }

}
