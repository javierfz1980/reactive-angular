import {Injectable} from "@angular/core";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Student, StudentInfo} from "../../../../models/content/student";
import {globalProperties} from "../../../../../environments/properties";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/content/profile";
import {Course} from "../../../../models/content/course";
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';
import {CoursesService} from "./courses.service";

@Injectable()
export class StudentsService {

  private path: string = globalProperties.studentsPath;

  constructor(private contentService: ContentService,
              private coursesService: CoursesService) {}

  getStudents(): Observable<Student[]> {
    return this.contentService
      .getContent<Student[]>(this.path);
  }

  getStudent(id: string): Observable<Student> {
    return this.contentService
      .getContent<Student>(`${this.path}/${id}`);
  }

  getStudentInfo(id: string): Observable<StudentInfo> {
    return this.getStudent(id)
      .do(data => console.log("data: ", data))
      .switchMap((student: Student) => {
        const profile: Observable<Profile> = this.contentService
          .getContent<Profile>(`${globalProperties.profilesPath}/${student.profile_id}`);

        const courses: Observable<Course[]> = Observable
          .from((student.courses) ? student.courses : [])
          .mergeMap((courseId: string) =>  this.coursesService.getCourse(courseId))
          .toArray();

        return Observable.forkJoin(profile, courses)
          .map(([profile, courses]) => ({info: student, profile: profile, courses: courses}))
      })
  }

  createStudent(data: StudentInfo): Observable<ContentAlert> {
    data = this.normalizeStudentInfo(data);

    const postProfile: Observable<Profile> = this.contentService
      .postContent<Profile>(globalProperties.profilesPath, data.profile);

    const postStudent: Observable<Student> = this.contentService
      .postContent<Student>(this.path, data.info);

    return Observable.forkJoin(postStudent, postProfile)
      .switchMap(([postStudent, postProfile]) => {
        const dataPatch = {
          profile_id: postProfile.id,
          courses: data.info.courses
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

  updateStudentInfo(data:StudentInfo): Observable<ContentAlert> {
    const infoId: string = data.info.id;
    const profileId: string = data.profile.id;

    data = this.normalizeStudentInfo(data, true);

    const patchInfo: Observable<Student> = this.contentService
      .patchContent<Student>(this.path, infoId, data.info);

    const patchProfile: Observable<Profile> = this.contentService
      .patchContent<Profile>(globalProperties.profilesPath, profileId, data.profile);

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

  private normalizeStudentInfo(data: StudentInfo, delteIds: boolean = false): StudentInfo {
    data.profile.birthday = new Date(data.profile.birthday).toString();
    data.info.courses = data.courses.map((course: Course) => course.id);
    if (delteIds) {
      delete data.info.id;
      delete data.profile.id;
    }
    return data;
  }
}
