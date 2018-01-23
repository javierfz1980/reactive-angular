import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../../models/content/course";
import {BasicContentService} from "./basic-content.service";

@Injectable()
export class CoursesService extends BasicContentService<Course> {

  private basePath: string = globalProperties.basePath;
  protected path: string = `${this.basePath}${globalProperties.coursesPath}`;
  courses: Observable<Course[]> = this.dataSubject.asObservable();

  /**
   * Removes a Student from a list of Courses.
   * @param {string} studentId: The Student id
   * @param {string[]} courses: The list of Courses where Student should be removed
   * @returns {Observable<Course[]>}
   */
  deleteStudentFromCourses(studentId: string, courses: string[]): Observable<Course[]> {
    if (!courses || courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => this.getRecord(courseId))
      .mergeMap((course: Course) => {
        course.students = course.students && course.students
          .filter((studentFilteredId: string) => studentFilteredId !== studentId);
        return this.updateRecord(course.id, {students: course.students})
      })
      .toArray();
  }

  /**
   * Adds/registers a Student to a list of Courses.
   * @param {string} studentId: The Student id
   * @param {string[]} courses: The list of Courses where Student should be added
   * @returns {Observable<Course[]>}
   */
  addStudentToCourses(studentId: string, courses: string[]): Observable<Course[]> {
    if (!courses || courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => this.getRecord(courseId))
      .mergeMap((course: Course) => {
        course.students = course.students ? [...course.students, studentId] : [studentId];
        return this.updateRecord(course.id, {students: course.students})
      })
      .toArray();
  }

  /**
   * Fetches and returns all the Courses assigned to a Teacher
   * @param {string} teacherId: The id of the teacher to fetch Courses
   * @returns {Observable<Course[]>}
   */
  getAllCoursesOfTeacher(teacherId: string): Observable<string[]> {
    return this.getRecords()
      .map((courses: Course[]) => courses.filter((course: Course) => course.teacher === teacherId))
      .map((courses: Course[]) => courses.map((course: Course) => course.id))
  }

  /**
   * Removes a Teacher from a list of Courses.
   * @param {string} teacherId: The Teacher id
   * @param {string[]} courses: The list of Courses where Student should be removed
   * @returns {Observable<Course[]>}
   */
  deleteTeacherFromCourses(teacherId: string, courses: string[]): Observable<Course[]> {
    if (!courses || courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => {
        return this.updateRecord(courseId, {teacher: null});
      })
      .toArray();
  }

  /**
   * Adds/registers a Teacher to a list of Courses.
   * @param {string} teacherId: The Teacher id
   * @param {string[]} courses: The list of Courses where Student should be added
   * @returns {Observable<Course[]>}
   */
  addTeacherToCourses(teacherId: string, courses: string[]): Observable<Course[]> {
    if (!courses || courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => {
        return this.updateRecord(courseId, {teacher: teacherId})
      })
      .toArray();
  }

}
