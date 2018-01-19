import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../models/content/teacher";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/content/profile";
import {Course} from "../../../../models/content/course";
import {InfoProfileData} from "../../../../content/commons/info-form/info-form.component";
import 'rxjs/add/observable/empty';

@Injectable()
export class TeachersService {

  private path: string = globalProperties.teachersPath;
  private profilesPath: string = globalProperties.profilesPath;
  private coursesPath: string = globalProperties.coursesPath;

  constructor(private contentService: ContentService) {}

  getTeachers(): Observable<Teacher[]> {
    return this.contentService
      .getContent<Teacher[]>(this.path);
  }

  getTeacher(id: string): Observable<Teacher> {
    return this.contentService
      .getContent<Teacher>(`${this.path}/${id}`);
  }

  getTeacherCourses(teacherId: string): Observable<Course[]> {
    return this.contentService.getContent<Course[]>(this.coursesPath)
      .map((courses: Course[]) => courses.filter((course: Course) => course.teacher === teacherId));
  }

  getTeacherInfo(id: string): Observable<InfoProfileData> {
    return this.getTeacher(id)
      .switchMap((teacher: Teacher) => {
        return Observable.forkJoin(
            this.contentService.getContent<Profile>(`${this.profilesPath}/${teacher.profile_id}`),
            this.getTeacherCourses(teacher.id)
              .map((courses: Course[]) => courses.map((course: Course) => course.id))
          )
          .map(([profile, courses]) => {
            teacher.courses = courses;
            return {info: teacher, profile: profile}
          })
      })
  }

  createTeacher(teacher: Teacher, profile: Profile, courses: string[]): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
        this.contentService.postContent<Profile>(this.profilesPath, profile),
        this.contentService.postContent<Teacher>(this.path, teacher)
      )
      .switchMap(([newProfile, newTeacher]) => {
        return Observable.forkJoin(
            this.contentService.patchContent<Teacher>(this.path, newTeacher.id, {profile_id: newProfile.id}),
            this.updateTeacherOnCourses(newTeacher.id, courses)
          )
          .map(() => (<ContentAlert>{
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

  updateTeacherOnCourses(teacherId: string, courses: string[]): Observable<Course[]> {
    if (courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => {
        return this.contentService.patchContent<Course>(this.coursesPath, courseId, {teacher: teacherId})
      })
      .toArray();
  }

  updateTeacherCourses(teacherId: string, coursesToBeRemoved: string[], coursesToBeAdded: string[]): Observable<Course[]> {
    return this.deleteTeacherFromCourses(teacherId, coursesToBeRemoved)
      .switchMap(() => this.updateTeacherOnCourses(teacherId, coursesToBeAdded));
  }

  updateTeacherInfo(teacher: Teacher, profile: Profile, coursesToBeRemoved: string[], coursesToBeAdded: string[]): Observable<ContentAlert> {
    const teacherId: string = teacher.id;
    const profileId: string = profile.id;

    delete teacher.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
        this.contentService.patchContent<Teacher>(this.path, teacherId, teacher),
        this.contentService.patchContent<Profile>(this.profilesPath, profileId, profile),
        this.updateTeacherCourses(teacherId, coursesToBeRemoved, coursesToBeAdded)
      )
      .map(() => (<ContentAlert>{
        type: "success",
        message: "Teacher info updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error updating info: ${error.message}`
      }))
  }

  deleteTeacherFromCourses(teacherId: string, courses: string[]): Observable<Course[]> {
    if (courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => {
        return this.contentService.patchContent<Course>(this.coursesPath, courseId, {teacher: null})
      })
      .toArray();
  }

  deleteTeacher(teacher: Teacher): Observable<ContentAlert> {
    return Observable.forkJoin(
        this.contentService.deleteContent<MessageResponse>(this.profilesPath, teacher.profile_id),
        this.contentService.deleteContent<MessageResponse>(this.path, teacher.id),
        this.deleteTeacherFromAllCourses(teacher.id)
      )
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

  deleteTeacherFromAllCourses(teacherId: string): Observable<Course[]> {
    return this.getTeacherCourses(teacherId)
      .switchMap((courses: Course[]) => {
        return this.deleteTeacherFromCourses(teacherId, courses.map(course => course.id))
      });
  }


}
