import {Injectable} from "@angular/core";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {globalProperties} from "../../../../../environments/properties";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/content/profile";
import {Course} from "../../../../models/content/course";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';

@Injectable()
export class StudentsService {

  private path: string = globalProperties.studentsPath;
  private profilesPath: string = globalProperties.profilesPath;
  private coursesPath: string = globalProperties.coursesPath;

  /**
   * Internal service data
   */
  private data: Student[] = [];

  /**
   * Internal service data emitter
   */
  private readonly studentsSubject: BehaviorSubject<Student[]> = new BehaviorSubject(this.data);
  students: Observable<Student[]> = this.studentsSubject.asObservable();

  constructor(private contentService: ContentService) {}

  /**
   * Fetches all Students or an individual Student from server, saves the data internally and emits.
   * @returns {Subscription}
   */
  fetchData(id?: string) {
    if (id) {
      return this.contentService
        .getContent<Student>(`${this.path}/${id}`)
        .subscribe((student: Student) => {
          if (this.data.length > 0) {
            this.data.forEach((studentData, idx) => {
              if (studentData.id === id) this.data[idx] = student;
            })
          } else {
            this.data.push(student);
          }
          this.studentsSubject.next(this.data.slice());
        })
    } else {
      return this.contentService
        .getContent<Student[]>(this.path)
        .subscribe((students: Student[]) => {
          this.data = students;
          this.studentsSubject.next(this.data.slice());
        })
    }
  }

  /**
   * Fetches and returns a Student Profile from server.
   * @param {string} id: The id of the profile to be fetched
   * @returns {Observable<Profile>}
   */
  getProfile(id: string): Observable<Profile> {
    return this.contentService
      .getContent<Profile>(`${this.profilesPath}/${id}`)
  }

  /**
   * Creates a new Student and returns a ContentAlert based on the response.
   * @param {Student} student: Student basic info
   * @param {Profile} profile: Student Profile info
   * @param {string[]} courses: The selected courses for the Student to be registered.
   * @returns {Observable<ContentAlert>}
   */
  createData(student: Student, profile: Profile, courses: string[]): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.contentService.postContent<Student>(this.path, student),
      this.contentService.postContent<Profile>(this.profilesPath, profile))
      .switchMap(([newStudent, newProfile]) => {
        return Observable.forkJoin(
          this.addStudentToCourses(newStudent.id, courses),
          this.contentService.patchContent<Student>(this.path, newStudent.id, ({
            profile_id: newProfile.id,
            courses: student.courses
          })))
          .do(() => this.fetchData())
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

  /**
   * Updates a Student and returns a ContentAlert based on the response.
   * @param {Student} student: Student basic info
   * @param {Profile} profile: Student Profile info
   * @param {string[]} coursesToBeRemoved: The list of Courses where Student should be removed
   * @param {string[]} coursesToBeAdded: The list of Courses where Student should be added.
   * @returns {Observable<ContentAlert>}
   */
  updateData(student:Student, profile: Profile, coursesToBeRemoved: string[],
             coursesToBeAdded: string[]): Observable<ContentAlert> {
    const infoId: string = student.id;
    const profileId: string = profile.id;

    delete student.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.contentService.patchContent<Student>(this.path, infoId, student),
      this.contentService.patchContent<Profile>(this.profilesPath, profileId, profile),
      this.updateStudentsCourses(infoId, coursesToBeRemoved, coursesToBeAdded))
      .do(() => this.fetchData())
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

  /**
   * Deletes a Student and returns a ContentAlert based on the response.
   * @param {Student} student: The Student to be deleted
   * @returns {Observable<ContentAlert>}
   */
  deleteData(student: Student): Observable<ContentAlert> {
    return Observable.forkJoin(
      this.contentService.deleteContent<MessageResponse>(this.profilesPath, student.profile_id),
      this.contentService.deleteContent<MessageResponse>(this.path, student.id),
      this.deleteStudentFromCourses(student.id, student.courses))
      .do(() => this.fetchData())
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

  /**
   * Updates the Courses where an Student is registered or not.
   * @param {string} studentId: The Student id
   * @param {string[]} coursesToBeRemoved: The list of Courses where Student should be removed
   * @param {string[]} coursesToBeAdded: The list of Courses where Student should be added
   * @returns {Observable<Course[]>}
   */
  private updateStudentsCourses(studentId: string, coursesToBeRemoved: string[],
                                coursesToBeAdded: string[]): Observable<Course[]> {
    return this.deleteStudentFromCourses(studentId, coursesToBeRemoved)
      .switchMap(() => this.addStudentToCourses(studentId, coursesToBeAdded))
  }

  /**
   * Adds/registers a Student to a list of Courses.
   * @param {string} studentId: The Student id
   * @param {string[]} courses: The list of Courses where Student should be added
   * @returns {Observable<Course[]>}
   */
  private addStudentToCourses(studentId: string, courses: string[]): Observable<Course[]> {
    if (courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => this.contentService
        .getContent<Course>(`${this.coursesPath}/${courseId}`))
      .mergeMap((course: Course) => {
        course.students = course.students ? [...course.students, studentId] : [studentId];
        return this.contentService
          .patchContent<Course>(this.coursesPath, course.id, {students: course.students})
      })
      .toArray();
  }

  /**
   * Removes a Student to a list of Courses.
   * @param {string} studentId: The Student id
   * @param {string[]} courses: The list of Courses where Student should be removed
   * @returns {Observable<Course[]>}
   */
  private deleteStudentFromCourses(studentId: string, courses: string[]): Observable<Course[]> {
    if (!courses || courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => this.contentService
        .getContent<Course>(`${this.coursesPath}/${courseId}`))
      .mergeMap((course: Course) => {
        course.students = course.students && course.students
          .filter((studentFilteredId: string) => studentFilteredId !== studentId);
        return this.contentService
          .patchContent<Course>(this.coursesPath, course.id, {students: course.students})
      })
      .toArray();
  }

}
