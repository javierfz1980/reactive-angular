import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../../models/content/course";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Teacher} from "../../../../models/content/teacher";

@Injectable()
export class CoursesService {

  private path: string = globalProperties.coursesPath;

  constructor(private contentService: ContentService) {}

  getCourses(): Observable<Course[]> {
    return this.contentService
      .getContent<Course[]>(this.path);
  }

  getCoursesWithTeachers(): Observable<Course[]> {
    return this.getCourses()
      .switchMap((courses: Course[]) => {
        return Observable.from(courses)
          .mergeMap((course: Course) => {
            if (!course.teacher) return Observable.of(course);
            return this.contentService
              .getContent<Teacher>(`${globalProperties.teachersPath}/${course.teacher}`)
              .map((teacher: Teacher) => {
                course.teacherInfo = teacher;
                return course;
              })
          })
      })
      .toArray();
  }

  getCourse(id: string): Observable<Course> {
    return this.contentService
      .getContent<Course>(`${this.path}/${id}`);
  }

  updateCourse(id: string, data: {[key: string]: any}): Observable<ContentAlert> {
    return this.contentService
      .patchContent<Course>(this.path, id, data)
      .map((course: Course) => (<ContentAlert>{
        type: "success",
        message: "The selected course status was updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: error.message,
        time: 3000
      }))
  }

  updateMultipleCoursesWithSameData(courses: string[], data: {[key: string]: any}): Observable<ContentAlert[]> {
    return Observable.from(courses)
      .mergeMap((id: string) => {
        return this.updateCourse(id, data)
      })
      .toArray();
  }

  deleteCourse(course: Course): Observable<ContentAlert> {
    return this.contentService
      .deleteContent<MessageResponse>(this.path, course.id)
      .map((message: MessageResponse) => (<ContentAlert>{
        type: "success",
        message: message.message,
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: error.message,
        time: 3000
      }))
  }
}
