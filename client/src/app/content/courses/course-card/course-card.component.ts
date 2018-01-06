import {Component, Input} from "@angular/core";
import {Course} from "../../../common/models/course";
import {Router} from "@angular/router";

@Component({
  selector: "gl-course-card",
  templateUrl: "./course-card.component.html"
})
export class CourseCardComponent {

  @Input()
  course: Course;

  constructor(private router: Router) {}

  /**
   * Navigates to a single Course
   */
  goToSingleCourse() {
    //this.router.navigate(["/" + routePaths.post + "/" + this.post.id]);
  }

}
