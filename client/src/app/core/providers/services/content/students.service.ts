import {Injectable} from "@angular/core";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {globalProperties} from "../../../../../environments/properties";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/content/profile";
import {InfoProfileData} from "../../../../content/commons/info-form/info-form.component";
import {Course} from "../../../../models/content/course";
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';

@Injectable()
export class StudentsService {

  private path: string = globalProperties.studentsPath;
  private profilesPath: string = globalProperties.profilesPath;
  private coursesPath: string = globalProperties.coursesPath;

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
          .getContent<Profile>(`${this.profilesPath}/${student.profile_id}`)
          .map((profile: Profile) => ({
            info: student,
            profile: profile
          }))
      })
  }

  createStudent(student: Student, profile: Profile, courses: string[]): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();
    return Observable.forkJoin(
        this.contentService.postContent<Student>(this.path, student),
        this.contentService.postContent<Profile>(this.profilesPath, profile)
      )
      .switchMap(([newStudent, newProfile]) => {
        return Observable.forkJoin(
            this.addStudentToCourses(newStudent.id, courses),
            this.contentService.patchContent<Student>(this.path, newStudent.id, ({
                profile_id: newProfile.id,
                courses: student.courses
              }))
          )
          .map(() => (<ContentAlert>{
            type: "success",
            message: "Student created",
            time: 3000
          }))
          .catch((error: any) => Observable.of(<ContentAlert>{
            type: "danger",
            message: `Error creating student: ${error.message}`
          }));
      })
  }

  updateStudentsForCourses(studentId: string, coursesToBeRemoved: string[], coursesToBeAdded: string[]): Observable<Course[]> {
    return this.removeStudentFromCourses(studentId, coursesToBeRemoved)
      .switchMap(() => this.addStudentToCourses(studentId, coursesToBeAdded))
  }

  addStudentToCourses(studentId: string, courses: string[]): Observable<Course[]> {
    if (courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => this.contentService
        .getContent<Course>(`${this.coursesPath}/${courseId}`))
      .switchMap((course: Course) => {
        course.students = course.students ? [...course.students, studentId] : [studentId];
        return this.contentService.patchContent<Course>(this.coursesPath, course.id, {students: course.students})
      })
      .toArray();
  }

  removeStudentFromCourses(studentId: string, courses: string[]): Observable<Course[]> {
    if (courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => this.contentService
        .getContent<Course>(`${this.coursesPath}/${courseId}`))
      .switchMap((course: Course) => {
        course.students = course.students && course.students
          .filter((studentFilteredId: string) => studentFilteredId !== studentId);
        return this.contentService.patchContent<Course>(this.coursesPath, course.id, {students: course.students})
      })
      .toArray();
  }

  updateStudentInfo(student:Student, profile: Profile, coursesToBeRemoved: string[], coursesToBeAdded: string[]): Observable<ContentAlert> {
    const infoId: string = student.id;
    const profileId: string = profile.id;

    delete student.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
        this.contentService.patchContent<Student>(this.path, infoId, student),
        this.contentService.patchContent<Profile>(this.profilesPath, profileId, profile),
        this.updateStudentsForCourses(infoId, coursesToBeRemoved, coursesToBeAdded)
      )
      .map(() => (<ContentAlert>{
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
    return Observable.forkJoin(
        this.contentService.deleteContent<MessageResponse>(this.profilesPath, student.profile_id),
        this.contentService.deleteContent<MessageResponse>(this.path, student.id),
        this.removeStudentFromCourses(student.id, student.courses)
      )
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
