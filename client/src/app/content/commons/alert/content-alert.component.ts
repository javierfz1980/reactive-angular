import {Component, Input} from "@angular/core";

export type ContentAlertType = "info" | "warning" | "success" | "danger";
export interface ContentAlert {
  type: ContentAlertType,
  message: string;
  time?: number;
}

@Component({
  selector: "gl-content-alert",
  templateUrl: "./content-alert.component.html"
})
export class ContentAlertComponent {

  closed: boolean = true;
  contentAlert: ContentAlert;

  @Input()
  set content(content: ContentAlert) {
    this.contentAlert = content;
    this.closed = false;
    if (content.time) {
      setTimeout(() => {
        this.onClose();
      }, content.time);
    }
  }

  onClose() {
    this.closed = true;
  }
}
