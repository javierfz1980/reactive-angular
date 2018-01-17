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
import {CoursesService} from "./courses.service";
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';

@Injectable()
export class StudentsService {

  private path: string = globalProperties.studentsPath;
  private profilesPath: string = globalProperties.profilesPath;

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

  createStudent(student: Student, profile: Profile): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();
    return Observable.forkJoin(
        this.contentService.postContent<Student>(this.path, student),
        this.contentService.postContent<Profile>(this.profilesPath, profile)
      )
      .switchMap(([postStudent, postProfile]) => {
        return Observable.forkJoin(
            this.addStudentToCourses(student.courses, postStudent),
            this.contentService.patchContent<Student>(this.path, postStudent.id, ({
                profile_id: postProfile.id,
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

  addStudentToCourses(courses: string[], student: Student): Observable<ContentAlert[]> {
    return Observable.from(courses)
      .mergeMap((id: string) => {
        return this.coursesService.getCourse(id)
      })
      .mergeMap((course: Course) => {
        const students: Student[] = course.students ? [...course.students, student] : [student];
        return this.coursesService.updateCourse(course.id, {students: students})
      })
      .toArray();
  }

  removeStudentFromAllCourses(studentId: string): Observable<ContentAlert[]> {
    return this.coursesService
      .getCourses()
      .map((courses: Course[]) => courses
        .filter((course: Course) => course.students)
        .filter((course: Course) => course.students
          .some((studentFiltered: Student) => studentFiltered.id === studentId)))
      .switchMap((courses: Course[]) => {
        return Observable.from(courses)
          .mergeMap((course: Course) => {
            const students: Student[] = course.students
              .filter((studentFiltered: Student) => studentFiltered.id !== studentId);
            return this.coursesService.updateCourse(course.id, {students: students})
          })
          .toArray();
      })
  }

  updateStudentInfo(student:Student, profile: Profile): Observable<ContentAlert> {
    const infoId: string = student.id;
    const profileId: string = profile.id;
    const studentCopy: Student = Object.assign({}, student);

    delete student.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
        this.contentService.patchContent<Student>(this.path, infoId, student),
        this.contentService.patchContent<Profile>(this.profilesPath, profileId, profile),
        this.removeStudentFromAllCourses(infoId)
          .switchMap(() => this.addStudentToCourses(student.courses, studentCopy))
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
        this.removeStudentFromAllCourses(student.id)
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
