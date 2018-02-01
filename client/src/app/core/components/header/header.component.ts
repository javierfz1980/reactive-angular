import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: "gl-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  readonly headerTitle: string = "Reactive Angular - GL";

}
