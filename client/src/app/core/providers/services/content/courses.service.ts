import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../../models/content/course";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Teacher} from "../../../../models/content/teacher";
import {Student} from "../../../../models/content/student";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class CoursesService {

  private path: string = globalProperties.coursesPath;
  private studentsPath: string = globalProperties.studentsPath;

  /**
   * Internal service data
   */
  private data: Course[] = [];

  /**
   * Internal service data emitter
   */
  private readonly coursesSubject: BehaviorSubject<Course[]> = new BehaviorSubject(this.data);
  courses: Observable<Course[]> = this.coursesSubject.asObservable();


  constructor(private contentService: ContentService) {}

  /**
   * Fetches all Courses or an individual Course from server, saves the data internally and emits.
   */
  fetchData(id?: string) {
    if (id) {
      return this.contentService
        .getContent<Course>(`${this.path}/${id}`)
        .subscribe((course: Course) => {
          if (this.data.length > 0) {
            this.data.forEach((courseData, idx) => {
              if (courseData.id === id) this.data[idx] = course;
            })
          } else {
            this.data.push(course);
          }
          this.coursesSubject.next(this.data.slice());
        })
    } else {
      return this.contentService
        .getContent<Course[]>(this.path)
        .subscribe((courses: Course[]) => {
          this.data = courses;
          this.coursesSubject.next(this.data.slice());
        })
    }
  }

  createData(course: Course, students: string[]): Observable<ContentAlert> {
    return this.contentService.postContent<Course>(this.path, course)
      .switchMap((createdCourse: Course) => {
        return this.contentService
          .patchContent<Course>(this.path, createdCourse.id, {teacher: course.teacher, students: students})
      })
      .switchMap((createdCourse: Course) => {
        return this.addCurseToStudents(createdCourse.id, students)
      })
      .do(() => this.fetchData())
      .map(() => (<ContentAlert>{
        type: "success",
        message: "Teacher created",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error creating teacher: ${error.message}`
      }));
  }

  updateData(course: Course, studentsToBeRemoved: string[], studentsToBeAdded: string[]): Observable<ContentAlert> {
    const courseId: string = course.id;
    delete course.id;

    return Observable.forkJoin(
      this.updateCourseForStudents(courseId, studentsToBeRemoved, studentsToBeAdded),
      this.contentService.patchContent<Course>(this.path, courseId, course))
      .do(() => this.fetchData())
      .map(() => (<ContentAlert>{
        type: "success",
        message: "The selected course was updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: error.message,
        time: 3000
      }))
  }

  deleteData(course: Course): Observable<ContentAlert> {
    return Observable.forkJoin(
      this.deleteCurseFromStudents(course.id, course.students),
      this.contentService.deleteContent<MessageResponse>(this.path, course.id))
      .do(() => this.fetchData())
      .map(([students, course]) => (<ContentAlert>{
        type: "success",
        message: course.message,
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: error.message,
        time: 3000
      }))
  }

  getCourseTeacher(id: string): Observable<Teacher> {
    return this.contentService
      .getContent<Teacher>(`${globalProperties.teachersPath}/${id}`);
  }

  changeCourseStatus(id: string, data: boolean): Observable<ContentAlert> {
    return this.contentService
      .patchContent<Course>(this.path, id, {active: data})
      .do(() => this.fetchData())
      .map((course: Course) => (<ContentAlert>{
        type: "success",
        message: "The selected course status was updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: error.message,
        time: 3000
      }))
  }

  private updateCourseForStudents(courseId: string, studentsToBeRemoved: string[], studentsToBeAdded: string[]): Observable<Student[]> {
    return this.deleteCurseFromStudents(courseId, studentsToBeRemoved)
      .switchMap(() => this.addCurseToStudents(courseId, studentsToBeAdded))
  }

  private addCurseToStudents(courseId: string, students: string[]): Observable<Student[]> {
    if (students.length === 0) return Observable.of([]);
    return Observable.from(students)
      .mergeMap((studentId: string) => {
        return this.contentService
          .getContent<Student>(`${this.studentsPath}/${studentId}`)
          .switchMap((student: Student) => {
            student.courses = student.courses ? [...student.courses, courseId] : [courseId];
            return this.contentService
              .patchContent<Student>(this.studentsPath, student.id, {courses: student.courses})
          })
      })
      .toArray()
  }

  private deleteCurseFromStudents(courseId: string, students: string[]): Observable<Student[]> {
    if (!students || students.length === 0) return Observable.of([]);
    return Observable.from(students)
      .mergeMap((studentId: string) => {
        return this.contentService
          .getContent<Student>(`${this.studentsPath}/${studentId}`)
          .switchMap((student: Student) => {
            student.courses = student.courses.filter((studentCourseId: string) => studentCourseId !== courseId);
            return this.contentService
              .patchContent<Student>(this.studentsPath, student.id, {courses: student.courses})
          })
      })
      .toArray();
  }
}
