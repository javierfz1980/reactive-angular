import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Course} from "../../../models/course";

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

  @Output('onToggle')
  toggleEvent: EventEmitter<Course> = new EventEmitter<Course>();

  toggle(course: Course) {
    this.toggleEvent.emit(course);
  }

  delete(course: Course) {
    this.deleteEvent.emit(course);
  }

}
