import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Profile} from "../../../../../models/content/profile";
import {BasicInfo} from "../../../../../models/content/basic-info";
import {BasicInfoForm} from "../../../abstarct-clases/basic-info-form";
import {getDateString} from "../../../../../helpers/helpers";
import {AuthService} from "../../../../../core/providers/services/auth.service";

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

  @Input()
  set info(data: InfoProfileData) {
    this.data = data;
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
      id: [this.data.info.id ],
      first_name: [this.data.info.first_name, Validators.required ],
      last_name: [this.data.info.last_name, Validators.required ],
      email: [this.data.info.email, [Validators.required, Validators.email] ],
      profile_id: [this.data.info.profile_id ],
      courses: [this.data.info.courses ]
    });

    this.profile_group = this.fb.group({
      id: [this.data.profile.id ],
      birthday: [getDateString(this.data.profile.birthday), Validators.required ],
      avatar: [this.data.profile.avatar],
      secondary_email: [this.data.profile.secondary_email],
      contact: this.fb.group({
        street: [this.data.profile.contact.street ,Validators.required],
        state: [this.data.profile.contact.state ,Validators.required],
        country: [this.data.profile.contact.country ,Validators.required],
        city: [this.data.profile.contact.city ,Validators.required],
        zip: [this.data.profile.contact.zip ,Validators.required],
        phone: [this.data.profile.contact.phone ,Validators.required],
      }),
    });

    this.form = this.fb.group({
      info: this.info_group,
      profile: this.profile_group
    })
  }

  private validateInfo(): InfoProfileData{
    if (!this.data) {
        return {
          info: {id: "", first_name: "", last_name: "", email: "", profile_id: "", courses: []},
          profile: {id: "", birthday: "", avatar: "", secondary_email: "", contact:
              {street: "", state: "", country: "", city: "", zip: "", phone: ""}
        }
      }
    }
    return this.data;
  }

}
