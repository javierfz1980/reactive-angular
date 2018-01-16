import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../models/content/teacher";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/content/profile";
import {Course} from "../../../../models/content/course";
import {CoursesService} from "./courses.service";
import 'rxjs/add/observable/empty';
import {InfoProfileData} from "../../../../content/commons/info-form/info-form.component";

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

  getTeacherInfo(id: string): Observable<InfoProfileData> {
    return this.getTeacher(id)
      .switchMap((teacher: Teacher) => {
        const profile: Observable<Profile> = this.contentService
          .getContent<Profile>(`${globalProperties.profilesPath}/${teacher.profile_id}`);

        const courses: Observable<string[]> = this.getTeacherCourses(teacher.id)
          .map((courses: Course[]) => courses.map((course: Course) => course.id));

        return Observable.forkJoin(profile, courses)
          .map(([profile, courses]) => ({info: teacher, profile: profile, courses: courses}))
      })
  }

  createTeacher(teacher: Teacher, profile: Profile, courses: string[]): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();

    const newProfile: Observable<Profile> = this.contentService
      .postContent<Profile>(globalProperties.profilesPath, profile);

    const info: Observable<Teacher> = this.contentService
      .postContent<Teacher>(this.path, teacher);

    return Observable.forkJoin(info, newProfile)
      .switchMap(([info, newProfile]) => {
        const patchTeacher: Observable<Teacher> = this.contentService
          .patchContent<Teacher>(this.path, info.id, {profile_id: newProfile.id});

        const patchCourses: Observable<ContentAlert[]> = this.coursesService
          .updateMultipleCoursesWithSameData(courses, {teacher: info.id})

        return Observable.forkJoin(patchTeacher, patchCourses)
          .map((data) => (<ContentAlert>{
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

  updateTeacherInfo(teacher: Teacher, profile: Profile, courses: string[]): Observable<ContentAlert> {
    const infoId: string = teacher.id;
    const profileId: string = profile.id;

    delete teacher.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    const patchInfo: Observable<Teacher> = this.contentService
      .patchContent<Teacher>(this.path, infoId, teacher);

    const patchProfile: Observable<Profile> = this.contentService
      .patchContent<Profile>(globalProperties.profilesPath, profileId, profile);

    const patchCourses: Observable<ContentAlert[]> = this.deleteAllCursesForTeacher(infoId)
      .switchMap(() => {
        return (courses.length === 0) ? Observable.of([]) : this.coursesService
          .updateMultipleCoursesWithSameData(courses, {teacher: infoId});
      });

    return Observable.forkJoin(patchInfo, patchProfile, patchCourses)
      .map((data) => (<ContentAlert>{
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


}
