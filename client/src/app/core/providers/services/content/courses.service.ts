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

  updateCourseInfo(course: Course, studentsToBeRemoved: string[], studentsToBeAdded: string[]): Observable<ContentAlert> {
    const courseId: string = course.id;
    delete course.id;

    return Observable.forkJoin(
      this.updateCourseForStudents(courseId, studentsToBeRemoved, studentsToBeAdded),
      this.updateCourse(courseId, course)
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

  updateCourseForStudents(courseId: string, studentsToBeRemoved: string[], studentsToBeAdded: string[]): Observable<Student[]> {
    return this.deleteCurseFromStudents(courseId, studentsToBeRemoved)
      .switchMap(() => this.addCurseToStudents(courseId, studentsToBeAdded))
  }

  createCourse(course: Course, students: string[]): Observable<ContentAlert> {
    return this.contentService.postContent<Course>(this.path, course)
      .switchMap((createdCourse: Course) => {
        return this.contentService
          .patchContent<Course>(this.path, createdCourse.id, {teacher: course.teacher, students: students})
      })
      .switchMap((createdCourse: Course) => {
        return this.addCurseToStudents(createdCourse.id, students)
      })
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

  addCurseToStudents(courseId: string, students: string[]): Observable<Student[]> {
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

  deleteCurseFromStudents(courseId: string, students: string[]): Observable<Student[]> {
    if (students.length === 0) return Observable.of([]);
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

  deleteCourse(course: Course): Observable<ContentAlert> {
    return Observable.forkJoin(
      this.deleteCurseFromStudents(course.id, course.students),
      this.contentService.deleteContent<MessageResponse>(this.path, course.id)
    )
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
}
