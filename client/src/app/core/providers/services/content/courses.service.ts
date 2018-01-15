import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../../models/content/course";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";

@Injectable()
export class CoursesService {

  private path: string = globalProperties.coursesPath;

  constructor(private contentService: ContentService) {}

  getCourses(): Observable<Course[]> {
    return this.contentService
      .getContent<Course[]>(this.path);
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

  patchCourse(id: string, data: {[key: string]: any}): Observable<ContentAlert> {
    return this.contentService
      .patchContent<Course>(this.path, id, data)
      .map((course: Course) => (<ContentAlert>{
        type: "success",
        message: "The slected course status was updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: error.message,
        time: 3000
      }))
  }
}
