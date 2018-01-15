import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../models/teacher";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Student} from "../../../../models/student";

@Injectable()
export class TeachersService {

  private path: string = globalProperties.teachersPath;

  constructor(private contentService: ContentService) {}

  getTeachers(): Observable<Teacher[]> {
    return this.contentService
      .getContent<Teacher[]>(this.path);
  }

  deleteTeacher(teacher: Teacher): Observable<ContentAlert> {
    const deleteProfile: Observable<MessageResponse> =  this.contentService
      .deleteContent<MessageResponse>(globalProperties.profilesPath, teacher.profile_id);

    const deleteTeacher: Observable<MessageResponse> =  this.contentService
      .deleteContent<MessageResponse>(this.path, teacher.id);

    return Observable.forkJoin(deleteProfile, deleteTeacher)
      .map(([deleteProfile, deleteTeacher]) => (<ContentAlert>{
        type: "success",
        message: deleteProfile.message,
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error deleting student: ${error.message}`,
        time: 3000
      }))
  }


}
