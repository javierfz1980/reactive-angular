import {Component, Input} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Component({
  selector: "gl-generic-amount",
  templateUrl: "./generic-amount.component.html",
  styleUrls: ["./generic-amount.component.css"]
})
export class GenericAmountComponent {

  @Input()
  title: number;

  @Input()
  total: Observable<number>;

  @Input()
  link: number;

}
