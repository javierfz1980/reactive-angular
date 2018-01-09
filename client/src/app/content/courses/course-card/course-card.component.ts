import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Course} from "../../../models/course";
import {Router} from "@angular/router";

@Component({
  selector: "gl-course-card",
  templateUrl: "./course-card.component.html",
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {

  @Input()
  course: Course;

  @Input()
  isAdministrator: boolean;

  @Output('onDelete')
  deleteEvent: EventEmitter<Course> = new EventEmitter<Course>();

  /**
   * Navigates to a single Course
   */
  goToSingleCourse() {
    //this.router.navigate(["/" + routePaths.post + "/" + this.post.id]);
  }

  delete(course: Course) {
    this.deleteEvent.emit(course);
  }

}
