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
import {InfoProfileData} from "../../../../content/commons/info-form/info-form.component";
import 'rxjs/add/observable/empty';

@Injectable()
export class TeachersService {

  private path: string = globalProperties.teachersPath;
  private profilesPath: string = globalProperties.profilesPath;

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
        return this.contentService.getContent<Profile>(`${this.profilesPath}/${teacher.profile_id}`)
          .map((profile) => ({
            info: teacher,
            profile: profile
          }))
      })
  }

  createTeacher(teacher: Teacher, profile: Profile, courses: string[]): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
        this.contentService.postContent<Profile>(this.profilesPath, profile),
        this.contentService.postContent<Teacher>(this.path, teacher)
      )
      .switchMap(([newProfile, info]) => {
        return Observable.forkJoin(
            this.contentService.patchContent<Teacher>(this.path, info.id, {profile_id: newProfile.id}),
            this.coursesService.updateMultipleCoursesWithSameData(courses, {teacher: info.id})
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

  updateTeacherInfo(teacher: Teacher, profile: Profile, courses: string[]): Observable<ContentAlert> {
    const infoId: string = teacher.id;
    const profileId: string = profile.id;

    delete teacher.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
        this.contentService.patchContent<Teacher>(this.path, infoId, teacher),
        this.contentService.patchContent<Profile>(this.profilesPath, profileId, profile),
        this.deleteAllCursesForTeacher(infoId)
          .switchMap(() => {
            return (courses.length === 0) ? Observable.of([]) : this.coursesService
              .updateMultipleCoursesWithSameData(courses, {teacher: infoId});
          })
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

  deleteTeacher(teacher: Teacher): Observable<ContentAlert> {
    return Observable.forkJoin(
        this.contentService.deleteContent<MessageResponse>(this.profilesPath, teacher.profile_id),
        this.contentService.deleteContent<MessageResponse>(this.path, teacher.id),
        this.deleteAllCursesForTeacher(teacher.id)
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

  deleteAllCursesForTeacher(id: string): Observable<ContentAlert[]> {
    return this.getTeacherCourses(id)
      .switchMap((courses: Course[]) => {
        return (courses.length === 0) ?  Observable.of([]) :  Observable.from(courses)
          .mergeMap((course: Course) => {
            return this.coursesService.updateCourse(course.id, {teacher: null})
          })
          .toArray();
      });
  }


}
