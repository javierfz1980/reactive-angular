import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {StudentsService} from "./students.service";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {ProfilesService} from "./profiles.service";
import {CoursesService} from "./courses.service";
import {Profile} from "../../../../models/content/profile";
import {TeachersService} from "./teachers.service";
import {Teacher} from "../../../../models/content/teacher";
import {Course} from "../../../../models/content/course";

@Injectable()
export class ContentService {

  constructor(private studentsService: StudentsService,
              private teachersService: TeachersService,
              private profilesService: ProfilesService,
              private coursesService: CoursesService) {}

  // fetches ---------------------

  fetchStudents(id?: string) {
    this.studentsService.fetchData(id);
  }

  fetchTeachers(id?: string) {
    this.teachersService.fetchData(id);
  }

  fetchCourses(id?: string) {
    this.coursesService.fetchData(id);
  }

  // getters ---------------------

  getProfile(id: string): Observable<Profile> {
    return this.profilesService.getRecord(id);
  }

  getStudents(): Observable<Student[]> {
    return this.studentsService.students;
  }

  getTeachers(): Observable<Teacher[]> {
    return this.teachersService.teachers;
  }

  getCourses(): Observable<Course[]> {
    return this.coursesService.courses;
  }

  getAllCoursesOfTeacher(id: string): Observable<string[]> {
    return this.coursesService.getAllCoursesOfTeacher(id);
  }

  getCourseTeacher(id: string): Observable<Teacher> {
    return this.teachersService.getRecord(id);
  }

  // creates ---------------------

  /**
   * Creates a Student and its Profile and adds the Student to the list of selected Courses
   * @param {Student} student: The new Student
   * @param {Profile} profile: The new Profile
   * @param {string[]} courses: The Courses to whom to add the Student
   * @returns {Observable<ContentAlert>}
   */
  createStudent(student: Student, profile: Profile, courses: string[]): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.studentsService.createRecord(student),
      this.profilesService.createRecord(profile))
      .switchMap(([newStudent, newProfile]) => {
        return Observable.forkJoin(
          this.coursesService.addStudentToCourses(newStudent.id, courses),
          this.studentsService.updateRecord(newStudent.id, ({
            profile_id: newProfile.id,
            courses: student.courses
          })))
          .map(() => (<ContentAlert>{
            type: "success",
            message: "Student created",
            time: 3000
          }))
          .catch((error: any) => Observable.of(<ContentAlert>{
            type: "danger",
            message: `Error creating student: ${error.message}`
          }))
          .do(() => this.fetchStudents());
      })
  }

  /**
   * Creates a Teacher and its Profile and adds the Teacher to the list of selected Courses
   * @param {Teacher} teacher: The new Teacher
   * @param {Profile} profile: The new Profile
   * @param {string[]} courses: The Courses to whom to add the Student
   * @returns {Observable<ContentAlert>}
   */
  createTeacher(teacher: Teacher, profile: Profile, courses: string[]): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.profilesService.createRecord(profile),
      this.teachersService.createRecord(teacher))
      .switchMap(([newProfile, newTeacher]) => {
        return Observable.forkJoin(
          this.teachersService.updateRecord(newTeacher.id,  {profile_id: newProfile.id}),
          this.coursesService.addTeacherToCourses(newTeacher.id, courses))
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
      .do(() => this.fetchTeachers())
  }

  /**
   * Creates a new Course with the selected Students and adds the Course to each Student courses.
   * @param {Course} course: The curse to be added
   * @param {string[]} students: the students to whom to add the course
   * @returns {Observable<ContentAlert>}
   */
  createCourse(course: Course, students: string[]): Observable<ContentAlert> {
    return this.coursesService.createRecord(course)
      .switchMap((createdCourse: Course) => this.coursesService
        .updateRecord(createdCourse.id, {teacher: course.teacher, students: students}))
      .switchMap((createdCourse: Course) => this.studentsService
        .addCurseToStudents(createdCourse.id, students))
      .map(() => (<ContentAlert>{
        type: "success",
        message: "Teacher created",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error creating teacher: ${error.message}`
      }))
      .do(() => this.fetchCourses())
  }

  // updates ---------------------

  /**
   * Updates a Student and returns a ContentAlert based on the response.
   * @param {Student} student: Student basic info
   * @param {Profile} profile: Student Profile info
   * @param {string[]} coursesToBeRemoved: The list of Courses where Student should be removed
   * @param {string[]} coursesToBeAdded: The list of Courses where Student should be added.
   * @returns {Observable<ContentAlert>}
   */
  updateStudent(student:Student, profile: Profile, coursesToBeRemoved: string[],
                coursesToBeAdded: string[]): Observable<ContentAlert> {
    const infoId: string = student.id;
    const profileId: string = profile.id;

    delete student.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.studentsService.updateRecord(infoId, student),
      this.profilesService.updateRecord(profileId, profile),
      this.coursesService.deleteStudentFromCourses(infoId, coursesToBeRemoved)
        .switchMap(() => this.coursesService.addStudentToCourses(infoId, coursesToBeAdded)))
      .map(() => (<ContentAlert>{
        type: "success",
        message: "Student info updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error updating info: ${error.message}`
      }))
      .do(() => this.fetchStudents())
  }

  /**
   * Updates a Teacher and returns a ContentAlert based on the response.
   * @param {Student} teacher: Student basic info
   * @param {Profile} profile: Student Profile info
   * @param {string[]} coursesToBeRemoved: The list of Courses where Teacher should be removed
   * @param {string[]} coursesToBeAdded: The list of Courses where Teacher should be added.
   * @returns {Observable<ContentAlert>}
   */
  updateTeacher(teacher: Teacher, profile: Profile, coursesToBeRemoved: string[],
                coursesToBeAdded: string[]): Observable<ContentAlert> {
    const teacherId: string = teacher.id;
    const profileId: string = profile.id;

    delete teacher.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.teachersService.updateRecord(teacherId, teacher),
      this.profilesService.updateRecord(profileId, profile),
      this.coursesService.deleteTeacherFromCourses(teacherId, coursesToBeRemoved)
        .switchMap(() => this.coursesService.addTeacherToCourses(teacherId, coursesToBeAdded)))
      .map(() => (<ContentAlert>{
        type: "success",
        message: "Teacher info updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error updating info: ${error.message}`
      }))
      .do(() => this.fetchTeachers())
  }

  /**
   * Updates a Course and returns a ContentAlert based on the response.
   * @param {Course} course: Course basic info
   * @param {string[]} studentsToBeRemoved: The list of Students where Course should be removed
   * @param {string[]} studentsToBeAdded:  The list of Students where Course should be added
   * @returns {Observable<ContentAlert>}
   */
  updateCourse(course: Course, studentsToBeRemoved: string[], studentsToBeAdded: string[]): Observable<ContentAlert> {
    const courseId: string = course.id;
    delete course.id;

    return Observable.forkJoin(
      this.coursesService.updateRecord(courseId, course),
      this.studentsService.removeCurseFromStudents(courseId, studentsToBeRemoved)
        .switchMap(() => this.studentsService.addCurseToStudents(courseId, studentsToBeAdded)))
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
      .do(() => this.fetchCourses())
  }

  /**
   * Updates the "active" status of a Course
   * @param {string} id: The id of the Course
   * @param {boolean} data: The value of the "active" property
   * @returns {Observable<ContentAlert>}
   */
  updateCourseStatus(id: string, data: boolean): Observable<ContentAlert> {
    return this.coursesService.updateRecord(id, {active: data})
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
      .do(() => this.fetchCourses())
  }

  // deletes ---------------------

  /**
   * Deletes a Student and returns a ContentAlert based on the response.
   * @param {Student} student: The Student to be deleted
   * @returns {Observable<ContentAlert>}
   */
  deleteStudent(student: Student): Observable<ContentAlert> {
    return Observable.forkJoin(
      this.profilesService.deleteRecord(student.profile_id),
      this.studentsService.deleteRecord(student.id),
      this.coursesService.deleteStudentFromCourses(student.id, student.courses))
      .map(([deleteProfile, deleteStudent]) => (<ContentAlert>{
        type: "success",
        message: deleteProfile.message,
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error deleting student: ${error.message}`,
      }))
      .do(() => this.fetchStudents());
  }

  /**
   * Deletes a Teacher and returns a ContentAlert based on the response.
   * @param {Teacher} teacher: The Teacher to be deleted
   * @returns {Observable<ContentAlert>}
   */
  deleteTeacher(teacher: Teacher): Observable<ContentAlert> {
    return Observable.forkJoin(
      this.profilesService.deleteRecord(teacher.profile_id),
      this.teachersService.deleteRecord(teacher.id),
      this.coursesService.getAllCoursesOfTeacher(teacher.id)
        .switchMap((courses: string[]) => this.coursesService.deleteTeacherFromCourses(teacher.id, courses)))
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
      .do(() => this.fetchTeachers())
  }

  /**
   * Deletes a Course and returns a ContentAlert based on the response.
   * @param {Course} course
   * @returns {Observable<ContentAlert>}
   */
  deleteCourse(course: Course): Observable<ContentAlert> {
    return Observable.forkJoin(
      this.studentsService.removeCurseFromStudents(course.id, course.students),
      this.coursesService.deleteRecord(course.id))
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
      .do(() => this.fetchCourses())
  }


}
