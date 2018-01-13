import {Component, Input} from "@angular/core";
import {Course} from "../../../../models/course";

@Component({
  selector: "gl-single-student-courses-form",
  templateUrl: "./courses-form.component.html"
})
export class CoursesFormComponent {

  @Input()
  courses: Course[];

  @Input()
  isReadOnly: boolean;

}
