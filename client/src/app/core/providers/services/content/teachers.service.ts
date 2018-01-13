import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../models/teacher";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";

@Injectable()
export class TeachersService {

  private path: string = globalProperties.teachersPath;

  constructor(private contentService: ContentService) {}

  getTeachers(): Observable<Teacher[]> {
    return this.contentService
      .getContent<Teacher[]>(this.path);
  }

  deleteTeacher(teacher: Teacher): Observable<ContentAlert> {
    return this.contentService
      .deleteContent<MessageResponse>(this.path, teacher.id)
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
