import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {globalProperties} from "../../../../../environments/properties";
import {BasicContentService} from "./basic-content.service";
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';

@Injectable()
export class StudentsService extends BasicContentService<Student> {

  private basePath: string = globalProperties.basePath;
  protected path: string = `${this.basePath}${globalProperties.studentsPath}`;
  students: Observable<Student[]> = this.dataSubject.asObservable();

  /**
   * Removes a Course from a list of Students
   * @param {string} courseId
   * @param {string[]} students
   * @returns {Observable<Student[]>}
   */
  removeCurseFromStudents(courseId: string, students: string[]): Observable<Student[]> {
    if (!students || students.length === 0) return Observable.of([]);
    return Observable.from(students)
      .mergeMap((studentId: string) => {
        return this.getRecord(studentId)
          .switchMap((student: Student) => {
            student.courses = student.courses.filter((studentCourseId: string) => studentCourseId !== courseId);
            return this.updateRecord(student.id, {courses: student.courses})
          })
      })
      .toArray();
  }

  /**
   * Adds a Course to a list of Students
   * @param {string} courseId
   * @param {string[]} students
   * @returns {Observable<Student[]>}
   */
  addCurseToStudents(courseId: string, students: string[]): Observable<Student[]> {
    if (!students || students.length === 0) return Observable.of([]);
    return Observable.from(students)
      .mergeMap((studentId: string) => {
        return this.getRecord(studentId)
          .switchMap((student: Student) => {
            student.courses = student.courses ? [...student.courses, courseId] : [courseId];
            return this.updateRecord(student.id, {courses: student.courses})
          })
      })
      .toArray()
  }

}
