import {Component, Input} from "@angular/core";

@Component({
  selector: "gl-generic-amount",
  templateUrl: "./generic-amount.component.html",
  styleUrls: ["./generic-amount.component.css"]
})
export class GenericAmountComponent {

  @Input()
  title: number;

  @Input()
  total: number;

  @Input()
  link: number;

}
