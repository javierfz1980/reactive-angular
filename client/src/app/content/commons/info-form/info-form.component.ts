import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Teacher} from "../../../models/content/teacher";
import {Student} from "../../../models/content/student";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Profile} from "../../../models/content/profile";

export type InfoProfileType = "create" | "update";

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
  info: InfoProfileData;

  @Input()
  isReadOnly: boolean;

  @Output('update')
  updateEvent: EventEmitter<InfoProfileData> = new EventEmitter<InfoProfileData>();

  @Output('create')
  createEvent: EventEmitter<InfoProfileData> = new EventEmitter<InfoProfileData>();

  form: FormGroup;
  info_fg: FormGroup;
  profile_fg: FormGroup;

  private type: InfoProfileType;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {

    this.type = this.info ? "update" : "create";
    // validate info received or make an empty info for use it as an input form. (new registers)
    this.info = this.validateInfo();

    this.info_fg = this.fb.group({
      id: [this.info.info.id ],
      first_name: [this.info.info.first_name, Validators.required ],
      last_name: [this.info.info.last_name, Validators.required ],
      email: [this.info.info.email, [Validators.required, Validators.email] ]
    });

    this.profile_fg = this.fb.group({
      id: [this.info.profile.id ],
      birthday: [this.getDateString(this.info.profile.birthday), Validators.required ],
      avatar: [this.info.profile.avatar],
      secondary_email: [this.info.profile.secondary_email],
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

  private getDateString(dateString: string): string {
    return dateString ? new Date(dateString).toISOString().slice(0,10) : "";
  }

  private validateInfo(): InfoProfileData{
    if (!this.info) {
        return {
          info: {id: "", first_name: "", last_name: "", email: "", profile_id: "", courses: []},
          profile: {id: "", birthday: "", avatar: "", secondary_email: "", contact: {
              street: "", state: "", country: "", city: "", zip: "", phone: ""}
        }
      }
    }
    return this.info;
  }

  update() {
    this.updateEvent.emit(this.getData());
  }

  create() {
    this.createEvent.emit(this.getData());
  }

  private getData(): InfoProfileData {
    return {
      info: this.form.controls["info"].value,
      profile: this.form.controls["profile"].value
    };
  }
}
