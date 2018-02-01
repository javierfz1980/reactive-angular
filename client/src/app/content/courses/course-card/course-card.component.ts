import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output,
  ViewChild
} from "@angular/core";
import {Course} from "../../../models/content/course";

@Component({
  selector: "gl-course-card",
  templateUrl: "./course-card.component.html",
  styleUrls: ['./course-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent {

  @Input()
  course: Course;

  @Input()
  isAdministrator: boolean;

  @Output("onDelete")
  deleteEvent: EventEmitter<Course> = new EventEmitter<Course>();

  @Output("onToggle")
  toggleEvent: EventEmitter<Course> = new EventEmitter<Course>();

  @Output("onEdit")
  editEvent: EventEmitter<Course> = new EventEmitter<Course>();

  @Output("onView")
  viewEvent: EventEmitter<Course> = new EventEmitter<Course>();

  @ViewChild("checkBoxStatus")
  checkBoxStatus: ElementRef;

  toggle(course: Course) {
    this.checkBoxStatus.nativeElement["checked"] = course.active;
    this.toggleEvent.emit(course);
  }

  delete(course: Course) {
    this.deleteEvent.emit(course);
  }

  editCourse(course: Course) {
    this.editEvent.emit(course);
  }

  viewCourse(course: Course) {
    this.viewEvent.emit(course);
  }

}
