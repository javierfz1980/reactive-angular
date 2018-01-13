import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Teacher} from "../../../models/teacher";
import {Student} from "../../../models/student";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Profile} from "../../../models/profile";

export interface InfoProfileData {
  info: Student | Teacher;
  profile: Profile;
}

@Component({
  selector: "gl-info-form",
  templateUrl: "./info-form.component.html",
  styleUrls: ["./info-form.component.css"]
})
export class ContentInfoComponent implements OnInit {

  @Input()
  info: InfoProfileData; //Student | Teacher;

  /*@Input()
  profile: Profile;*/

  @Input()
  isReadOnly: boolean;

  @Output('update')
  updateEvent: EventEmitter<InfoProfileData> = new EventEmitter<InfoProfileData>();

  @Output('delete')
  deleteEvent: EventEmitter<InfoProfileData> = new EventEmitter<InfoProfileData>();

  form: FormGroup;
  info_fg: FormGroup;
  profile_fg: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.info_fg = this.fb.group({
      id: [this.info.info.id, Validators.required ],
      first_name: [this.info.info.first_name, Validators.required ],
      last_name: [this.info.info.last_name, Validators.required ],
      email: [this.info.info.email, [Validators.required, Validators.email] ]
    });

    this.profile_fg = this.fb.group({
      id: [this.info.profile.id, Validators.required ],
      birthday: [this.info.profile.birthday, Validators.required ],
      avatar: [this.info.profile.avatar, Validators.required ],
      secondary_email: [this.info.profile.secondary_email, Validators.required ],
      contact: this.fb.group({
        street: [this.info.profile.contact.street ,Validators.required],
        state: [this.info.profile.contact.state ,Validators.required],
        country: [this.info.profile.contact.country ,Validators.required],
        city: [this.info.profile.contact.city ,Validators.required],
        zip: [this.info.profile.contact.zip ,Validators.required],
        phone: [this.info.profile.contact.phone ,Validators.required],
      }),
    });

    this.form = this.fb.group({
      info: this.info_fg,
      profile: this.profile_fg
    })
  }

  update() {
    this.updateEvent.emit(this.getData());
  }

  delete() {
    this.deleteEvent.emit(this.getData());
  }

  private getData(): InfoProfileData {
    return {
      info: this.form.controls["info"].value,
      profile: this.form.controls["profile"].value
    };
  }
}
