import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Teacher, TeacherInfo} from "../../../../models/content/teacher";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Student, StudentInfo} from "../../../../models/content/student";
import {Profile} from "../../../../models/content/profile";
import {Course} from "../../../../models/content/course";

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

  createTeacher(data: TeacherInfo): Observable<ContentAlert> {
    data = this.normalizeStudentInfo(data);

    const profile: Observable<Profile> = this.contentService
      .postContent<Profile>(globalProperties.profilesPath, data.profile);

    const info: Observable<Teacher> = this.contentService
      .postContent<Teacher>(this.path, data.info);

    return Observable.forkJoin(info, profile)
      .switchMap(([info, profile]) => {
        const dataPatch = {
          profile_id: profile.id,
          courses: data.info.courses
        };
        return this.contentService.patchContent<Student>(this.path, info.id, dataPatch)
      })
      .map((data: Teacher) => (<ContentAlert>{
        type: "success",
        message: "Student created",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error creating student: ${error.message}`
      }));
  }

  private normalizeStudentInfo(data: TeacherInfo, delteIds: boolean = false): TeacherInfo {
    data.profile.birthday = new Date(data.profile.birthday).toString();
    data.info.courses = data.courses.map((course: Course) => course.id);
    if (delteIds) {
      delete data.info.id;
      delete data.profile.id;
    }
    return data;
  }


}
