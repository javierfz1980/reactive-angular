import {Injectable} from "@angular/core";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {globalProperties} from "../../../../../environments/properties";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/content/profile";
import {InfoProfileData} from "../../../../content/commons/info-form/info-form.component";
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';

@Injectable()
export class StudentsService {

  private path: string = globalProperties.studentsPath;

  constructor(private contentService: ContentService) {}

  getStudents(): Observable<Student[]> {
    return this.contentService
      .getContent<Student[]>(this.path);
  }

  getStudent(id: string): Observable<Student> {
    return this.contentService
      .getContent<Student>(`${this.path}/${id}`);
  }

  getStudentInfo(id: string): Observable<InfoProfileData> {
    return this.getStudent(id)
      .switchMap((student: Student) => {
        return this.contentService
          .getContent<Profile>(`${globalProperties.profilesPath}/${student.profile_id}`)
          .map((profile: Profile) => ({
            info: student,
            profile: profile
          }))
      })
  }

  createStudent(student: Student, profile: Profile): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();

    const postProfile: Observable<Profile> = this.contentService
      .postContent<Profile>(globalProperties.profilesPath, profile);

    const postStudent: Observable<Student> = this.contentService
      .postContent<Student>(this.path, student);

    return Observable.forkJoin(postStudent, postProfile)
      .switchMap(([postStudent, postProfile]) => {
        const dataPatch = {
          profile_id: postProfile.id,
          courses: student.courses
        };
        return this.contentService.patchContent<Student>(this.path, postStudent.id, dataPatch)
      })
      .map((student: Student) => (<ContentAlert>{
        type: "success",
        message: "Student created",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error creating student: ${error.message}`
      }));
  }

  updateStudentInfo(student:Student, profile: Profile): Observable<ContentAlert> {
    const infoId: string = student.id;
    const profileId: string = profile.id;

    delete student.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    const patchInfo: Observable<Student> = this.contentService
      .patchContent<Student>(this.path, infoId, student);

    const patchProfile: Observable<Profile> = this.contentService
      .patchContent<Profile>(globalProperties.profilesPath, profileId, profile);

    return Observable.forkJoin(patchInfo, patchProfile)
      .map(([patchInfo, patchProfile]) => (<ContentAlert>{
        type: "success",
        message: "Student info updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error updating info: ${error.message}`
      }))
  }

  deleteStudent(student: Student): Observable<ContentAlert> {
    const deleteProfile: Observable<MessageResponse> =  this.contentService
      .deleteContent<MessageResponse>(globalProperties.profilesPath, student.profile_id);

    const deleteStudent: Observable<MessageResponse> =  this.contentService
      .deleteContent<MessageResponse>(this.path, student.id);

    return Observable.forkJoin(deleteProfile, deleteStudent)
      .map(([deleteProfile, deleteStudent]) => (<ContentAlert>{
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
