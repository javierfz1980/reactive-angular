import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Teacher, TeacherInfo} from "../../../../models/content/teacher";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/content/profile";
import {Course} from "../../../../models/content/course";
import {CoursesService} from "./courses.service";
import 'rxjs/add/observable/empty';

@Injectable()
export class TeachersService {

  private path: string = globalProperties.teachersPath;

  constructor(private contentService: ContentService,
              private coursesService: CoursesService) {}

  getTeachers(): Observable<Teacher[]> {
    return this.contentService
      .getContent<Teacher[]>(this.path);
  }

  getTeacher(id: string): Observable<Teacher> {
    return this.contentService
      .getContent<Teacher>(`${this.path}/${id}`);
  }

  getTeacherCourses(teacherId: string): Observable<Course[]> {
    return this.coursesService
      .getCourses()
      .map((courses: Course[]) => courses.filter((course: Course) => course.teacher === teacherId));
  }

  getTeacherInfo(id: string): Observable<TeacherInfo> {
    return this.getTeacher(id)
      .do(data => console.log("data: ", data))
      .switchMap((teacher: Teacher) => {
        const profile: Observable<Profile> = this.contentService
          .getContent<Profile>(`${globalProperties.profilesPath}/${teacher.profile_id}`);

        const courses: Observable<Course[]> = this.getTeacherCourses(teacher.id);

        return Observable.forkJoin(profile, courses)
          .map(([profile, courses]) => ({info: teacher, profile: profile, courses: courses}))
      })
  }

  createTeacher(data: TeacherInfo): Observable<ContentAlert> {
    data = this.normalizeInfo(data);
    const selectedCourses: Course[] = data.courses;

    const profile: Observable<Profile> = this.contentService
      .postContent<Profile>(globalProperties.profilesPath, data.profile);

    const info: Observable<Teacher> = this.contentService
      .postContent<Teacher>(this.path, data.info);

    return Observable.forkJoin(info, profile)
      .switchMap(([info, profile]) => {
        const patchTeacher: Observable<Teacher> = this.contentService
          .patchContent<Teacher>(this.path, info.id, {
            profile_id: profile.id,
            courses: data.info.courses
          });
        const patchCourses: Observable<ContentAlert[]> = this.coursesService
          .updateMultipleCoursesWithSameData(selectedCourses, {teacher: info.id})

        return Observable.forkJoin(patchTeacher, patchCourses)
          .map(([patchTeacher, patchCourses]) => (<ContentAlert>{
            type: "success",
            message: "Teacher created",
            time: 3000
          }))
          .catch((error: any) => Observable.of(<ContentAlert>{
            type: "danger",
            message: `Error creating teacher: ${error.message}`
          }));
      })

  }

  updateTeacherInfo(data:TeacherInfo): Observable<ContentAlert> {
    const infoId: string = data.info.id;
    const profileId: string = data.profile.id;

    data = this.normalizeInfo(data, true);

    const patchInfo: Observable<Teacher> = this.contentService
      .patchContent<Teacher>(this.path, infoId, data.info);

    const patchProfile: Observable<Profile> = this.contentService
      .patchContent<Profile>(globalProperties.profilesPath, profileId, data.profile);

    const patchCourses: Observable<ContentAlert[]> = this.deleteAllCursesForTeacher(infoId)
      .switchMap(() => {
        return (data.courses.length === 0) ?  Observable.of([]) : this.coursesService
          .updateMultipleCoursesWithSameData(data.courses, {teacher: infoId});
      });

    return Observable.forkJoin(patchInfo, patchProfile, patchCourses)
      .map(([patchInfo, patchProfile, patchCourses]) => (<ContentAlert>{
        type: "success",
        message: "Teacher info updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error updating info: ${error.message}`
      }))
  }

  deleteTeacher(teacher: Teacher): Observable<ContentAlert> {
    const deleteProfile: Observable<MessageResponse> =  this.contentService
      .deleteContent<MessageResponse>(globalProperties.profilesPath, teacher.profile_id);

    const deleteTeacher: Observable<MessageResponse> =  this.contentService
      .deleteContent<MessageResponse>(this.path, teacher.id);

    const deleteTeacherCourses: Observable<ContentAlert> = this.deleteAllCursesForTeacher(teacher.id);

    return Observable.forkJoin(deleteProfile, deleteTeacher, deleteTeacherCourses)
      .map(([deleteProfile, deleteTeacher, deleteTeacherCourses]) => (<ContentAlert>{
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

  deleteAllCursesForTeacher(id: string): Observable<ContentAlert> {
    return this.getTeacherCourses(id)
      .switchMap((courses: Course[]) => {
        return (courses.length === 0) ?  Observable.of([]) :  Observable.from(courses)
          .mergeMap((course: Course) => {
            return this.coursesService.updateCourse(course.id, {teacher: null})
          });
      });
  }

  private normalizeInfo(data: TeacherInfo, delteIds: boolean = false): TeacherInfo {
    data.profile.birthday = new Date(data.profile.birthday).toString();
    data.info.courses = data.courses.map((course: Course) => course.id);
    if (delteIds) {
      delete data.info.id;
      delete data.profile.id;
    }
    return data;
  }


}
