import {Component} from "@angular/core";

@Component({
  selector: "gl-header",
  templateUrl: "./header.component.html",
  styles: []
})
export class HeaderComponent {

  readonly headerTitle: string = "Reactive Angular - GL";

  constructor() {}

  logout() {
    // TODO
  }

}
