import {Component, Input} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../models/content/teacher";
import {Student} from "../../../models/content/student";
import {Course} from "../../../models/content/course";

export interface DashboardAmount {
  total: number;
}

@Component({
  selector: "gl-generic-amount",
  templateUrl: "./generic-amount.component.html",
  styleUrls: ["./generic-amount.component.css"]
})
export class GenericAmountComponent {

  @Input()
  title: number;

  @Input()
  data: Observable<Course[] | Teacher[] | Student[]>;

  @Input()
  link: number;

}
