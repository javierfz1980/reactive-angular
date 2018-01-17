import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../../models/content/course";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Teacher} from "../../../../models/content/teacher";
import {Student} from "../../../../models/content/student";

@Injectable()
export class CoursesService {

  private path: string = globalProperties.coursesPath;
  private studentsPath: string = globalProperties.studentsPath;

  constructor(private contentService: ContentService) {}

  getCourses(): Observable<Course[]> {
    return this.contentService
      .getContent<Course[]>(this.path);
  }

  getCoursesWithTeachers(): Observable<Course[]> {
    return this.getCourses()
      .switchMap((courses: Course[]) => {
        return Observable.from(courses)
          .mergeMap((course: Course) => {
            if (!course.teacher) return Observable.of(course);
            return this.contentService
              .getContent<Teacher>(`${globalProperties.teachersPath}/${course.teacher}`)
              .map((teacher: Teacher) => {
                course.teacherInfo = teacher;
                return course;
              })
          })
      })
      .toArray();
  }

  getCourse(id: string): Observable<Course> {
    return this.contentService
      .getContent<Course>(`${this.path}/${id}`);
  }

  updateCourse(id: string, data: {[key: string]: any}): Observable<ContentAlert> {
    return this.contentService
      .patchContent<Course>(this.path, id, data)
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

  updateMultipleCoursesWithSameData(courses: string[], data: {[key: string]: any}): Observable<ContentAlert[]> {
    return Observable.from(courses)
      .mergeMap((id: string) => {
        return this.updateCourse(id, data)
      })
      .toArray();
  }

  updateCourseInfo(course: Course): Observable<ContentAlert> {
    const courseCopy: Course = Object.assign({}, course);
    delete course.id;

    return Observable.forkJoin(
      this.updateCourseForStudents(courseCopy),
      this.updateCourse(courseCopy.id, course)
    )
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

  updateCourseForStudents(course: Course): Observable<Student> {
    return this.delteCurseFromStudents(course.id)
      .switchMap(() => {
        console.log("ACA1: ", course.students.length);
        if (course.students.length === 0) return Observable.of([]);
        return Observable.from(course.students)
          .mergeMap((studentId: string) => {
            return this.contentService.getContent<Student>(`${this.studentsPath}/${studentId}`)
              .switchMap((student: Student) => {
                student.courses = student.courses ? [...student.courses, course.id] : [course.id];
                return this.contentService.patchContent<Student>(this.studentsPath, student.id, {courses: student.courses})
              })
          })
      })
  }

  delteCurseFromStudents(id: string): Observable<Student> {
    return this.contentService.getContent<Student[]>(this.studentsPath)
      .map((students: Student[]) => {
        return students.filter((student: Student) => student.courses && student.courses
          .some((courseId: string) => courseId === id))
      })
      .switchMap((students: Student[]) => {
        console.log("ACA2: ", students.length);
        if (students.length === 0) return Observable.of([]);
        return Observable.from(students)
          .mergeMap((student: Student) => {
            student.courses = student.courses.filter((courseId: string) => courseId !== id);
            return this.contentService
              .patchContent<Student>(this.studentsPath, student.id, {courses: student.courses})
          })
      })
  }

  deleteCourse(course: Course): Observable<ContentAlert> {
    // TODO: also remove this course form students.courses !!!
    return this.contentService
      .deleteContent<MessageResponse>(this.path, course.id)
      .map((message: MessageResponse) => (<ContentAlert>{
        type: "success",
        message: message.message,
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: error.message,
        time: 3000
      }))
  }
}
