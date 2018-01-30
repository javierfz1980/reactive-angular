import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../../../../models/content/student";
import {StudentsService} from "./students.service";
import {ProfilesService} from "./profiles.service";
import {CoursesService} from "./courses.service";
import {Profile} from "../../../../models/content/profile";
import {TeachersService} from "./teachers.service";
import {Teacher} from "../../../../models/content/teacher";
import {Course} from "../../../../models/content/course";
import {AlertService} from "../alert.service";
import {StoreData} from "../../../../models/core/store-data";

@Injectable()
export class ContentService {

  constructor(private studentsService: StudentsService,
              private teachersService: TeachersService,
              private profilesService: ProfilesService,
              private coursesService: CoursesService,
              private alertService: AlertService) {}

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

  getStudents(): Observable<StoreData<Student>> {
    return this.studentsService.source
      .filter(data => data !== undefined);
  }

  getTeachers(): Observable<StoreData<Teacher>> {
    return this.teachersService.source
      .filter(data => data !== undefined);
  }

  getCourses(): Observable<StoreData<Course>> {
    return this.coursesService.source
      .filter(data => data !== undefined);
  }

  getProfile(id: string): Observable<Profile> {
    return this.profilesService.getRecord(id);
  }

  getAllCoursesOfTeacher(id: string): Observable<string[]> {
    return this.coursesService.getAllCoursesOfTeacher(id);
  }

  getCourseTeacher(id: string): Observable<Teacher> {
    return this.teachersService.getRecord(id);
  }

  getActiveCoursesWithTeacher(): Observable<StoreData<Course>> {
    return this.coursesService.getRecords()
      .map((data: Course[]) => {
        data = !data ? [] : data
          .filter((course: Course) => course.active);
        return data;
      })
      .switchMap((data: Course[]) => {
        return Observable.from(data ? data : [])
          .mergeMap((course: Course) => {
            if (!course.teacher) return Observable.of(course);
            return this.teachersService.getRecord(course.teacher)
              .map((teacher: Teacher) => {
                course.teacherInfo = teacher;
                return course;
              })
          })
      })
      .toArray()
      .map((coursesWithTeacher: Course[]) => ({data: coursesWithTeacher, loading: false}))
      .startWith({data: null, loading: true});
  }

  // creates ---------------------

  /**
   * Creates a Student and its Profile and adds the Student to the list of selected Courses
   * @param {Student} student: The new Student
   * @param {Profile} profile: The new Profile
   * @param {string[]} courses: The Courses to whom to add the Student
   * @returns {Observable<boolean>}
   */
  createStudent(student: Student, profile: Profile, courses: string[]): Observable<boolean> {
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
      })
      .switchMap(() => {
        return Observable.forkJoin(
          this.profilesService.getRecords(),
          this.studentsService.getRecords(),
          this.coursesService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Student ${student.first_name} ${student.last_name} was created`, duration: 3000});
            this.profilesService.emit();
            this.studentsService.emit();
            this.coursesService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error creating Student ${student.first_name} ${student.last_name}: ${error.message}`});
        return Observable.of(false);
      })
  }

  /**
   * Creates a Teacher and its Profile and adds the Teacher to the list of selected Courses
   * @param {Teacher} teacher: The new Teacher
   * @param {Profile} profile: The new Profile
   * @param {string[]} courses: The Courses to whom to add the Student
   * @returns {Observable<boolean>}
   */
  createTeacher(teacher: Teacher, profile: Profile, courses: string[]): Observable<boolean> {
    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.profilesService.createRecord(profile),
      this.teachersService.createRecord(teacher))
      .switchMap(([newProfile, newTeacher]) => {
        return Observable.forkJoin(
          this.teachersService.updateRecord(newTeacher.id,  {profile_id: newProfile.id}),
          this.coursesService.addTeacherToCourses(newTeacher.id, courses))
      })
      .switchMap(() => {
        return Observable.forkJoin(
          this.profilesService.getRecords(),
          this.teachersService.getRecords(),
          this.coursesService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Teacher ${teacher.first_name} ${teacher.last_name} was created`, duration: 3000});
            this.profilesService.emit();
            this.teachersService.emit();
            this.coursesService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error creating Teacher ${teacher.first_name} ${teacher.last_name}: ${error.message}`});
        return Observable.of(false);
      })
  }

  /**
   * Creates a new Course with the selected Students and adds the Course to each Student courses.
   * @param {Course} course: The curse to be added
   * @param {string[]} students: the students to whom to add the course
   * @returns {Observable<boolean>}
   */
  createCourse(course: Course, students: string[]): Observable<boolean> {
    return this.coursesService.createRecord(course)
      .switchMap((createdCourse: Course) => this.coursesService
        .updateRecord(createdCourse.id, {teacher: course.teacher, students: students}))
      .switchMap((createdCourse: Course) => this.studentsService
        .addCurseToStudents(createdCourse.id, students))
      .switchMap(() => {
        return Observable.forkJoin(
          this.coursesService.getRecords(),
          this.studentsService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Course ${course.title} was created`, duration: 3000});
            this.coursesService.emit();
            this.studentsService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error creating Course ${course.title}: ${error.message}`});
        return Observable.of(false);
      })
  }

  // updates ---------------------

  /**
   * Updates a Student and returns a Alert based on the response.
   * @param {Student} student: Student basic info
   * @param {Profile} profile: Student Profile info
   * @param {string[]} coursesToBeRemoved: The list of Courses where Student should be removed
   * @param {string[]} coursesToBeAdded: The list of Courses where Student should be added.
   * @returns {Observable<boolean>}
   */
  updateStudent(student:Student, profile: Profile, coursesToBeRemoved: string[],
                coursesToBeAdded: string[]): Observable<boolean> {

    const studentData: Student = Object.assign({}, student);
    const profileData: Profile = Object.assign({}, profile);
    delete studentData.id;
    delete profileData.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.studentsService.updateRecord(student.id, studentData),
      this.profilesService.updateRecord(profile.id, profileData),
      this.coursesService.deleteStudentFromCourses(student.id, coursesToBeRemoved)
        .switchMap(() => this.coursesService.addStudentToCourses(student.id, coursesToBeAdded)))
      .switchMap(() => {
        return Observable.forkJoin(
          this.studentsService.getRecord(student.id),
          this.profilesService.getRecord(profile.id),
          this.coursesService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Student ${student.id} was updated`, duration: 3000});
            this.studentsService.emit();
            this.profilesService.emit();
            this.coursesService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error updating Student ${student.id}: ${error.message}`});
        return Observable.of(false);
      })
  }

  /**
   * Updates a Teacher and returns a Alert based on the response.
   * @param {Student} teacher: Student basic info
   * @param {Profile} profile: Student Profile info
   * @param {string[]} coursesToBeRemoved: The list of Courses where Teacher should be removed
   * @param {string[]} coursesToBeAdded: The list of Courses where Teacher should be added.
   * @returns {Observable<boolean>}
   */
  updateTeacher(teacher: Teacher, profile: Profile, coursesToBeRemoved: string[],
                coursesToBeAdded: string[]): Observable<boolean> {

    const teacherData: Teacher = Object.assign({}, teacher);
    const profileData: Profile = Object.assign({}, profile);
    delete teacherData.id;
    delete profileData.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.teachersService.updateRecord(teacher.id, teacherData),
      this.profilesService.updateRecord(profile.id, profileData),
      this.coursesService.deleteTeacherFromCourses(teacher.id, coursesToBeRemoved)
        .switchMap(() => this.coursesService.addTeacherToCourses(teacher.id, coursesToBeAdded)))
      .switchMap(() => {
        return Observable.forkJoin(
          this.teachersService.getRecord(teacher.id),
          this.profilesService.getRecord(profile.id),
          this.coursesService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Teacher ${teacher.id} was updated`, duration: 3000});
            this.teachersService.emit();
            this.profilesService.emit();
            this.coursesService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error updating Teacher ${teacher.id}: ${error.message}`});
        return Observable.of(false);
      })
  }

  /**
   * Updates a Course and returns a Alert based on the response.
   * @param {Course} course: Course basic info
   * @param {string[]} studentsToBeRemoved: The list of Students where Course should be removed
   * @param {string[]} studentsToBeAdded:  The list of Students where Course should be added
   * @returns {Observable<boolean>}
   */
  updateCourse(course: Course, studentsToBeRemoved: string[], studentsToBeAdded: string[]): Observable<boolean> {
    const courseData: Course = Object.assign({}, course);
    delete courseData.id;

    return Observable.forkJoin(
      this.coursesService.updateRecord(course.id, courseData),
      this.studentsService.removeCurseFromStudents(course.id, studentsToBeRemoved)
        .switchMap(() => this.studentsService.addCurseToStudents(course.id, studentsToBeAdded)))
      .switchMap(() => {
        return Observable.forkJoin(
          this.coursesService.getRecords(),
          this.studentsService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Course ${course.id} was updated`, duration: 3000});
            this.coursesService.emit();
            this.studentsService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error updating Course ${course.id}: ${error.message}`});
        return Observable.of(false);
      })
  }

  /**
   * Updates the "active" status of a Course
   * @param {string} id: The id of the Course
   * @param {boolean} data: The value of the "active" property
   * @returns {Observable<boolean>}
   */
  updateCourseStatus(id: string, data: boolean): Observable<boolean> {
    return this.coursesService.updateRecord(id, {active: data})
      .switchMap((course: Course) => this.coursesService.getRecord(course.id))
      .map(() => {
        this.alertService.pushAlert(
          {type: "success", message: `Course ${id} status was updated`, duration: 3000});
        this.coursesService.emit();
        return true;
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error updating Course Status ${id}: ${error.message}`});
        return Observable.of(false);
      })
  }

  // deletes ---------------------

  /**
   * Deletes a Student and pushes an Alert based on the response and returns true or false based on success
   * @param {Student} student: The Student to be deleted
   * @returns {Observable<boolean>}
   */
  deleteStudent(student: Student): Observable<boolean> {
    return Observable.forkJoin(
      this.profilesService.deleteRecord(student.profile_id),
      this.coursesService.deleteStudentFromCourses(student.id, student.courses),
      this.studentsService.deleteRecord(student.id))
      .switchMap(() => {
        return Observable.forkJoin(
          this.profilesService.getRecords(),
          this.coursesService.getRecords(),
          this.studentsService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Student ${student.id} was deleted`, duration: 3000});
            this.profilesService.emit();
            this.coursesService.emit();
            this.studentsService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error deleting student ${student.id}: ${error.message}`});
        return Observable.of(false);
      })
  }

  /**
   * Deletes a Teacher and pushes an Alert based on the response and returns true or false based on success
   * @param {Teacher} teacher: The Teacher to be deleted
   * @returns {Observable<boolean>}
   */
  deleteTeacher(teacher: Teacher): Observable<boolean> {
    return Observable.forkJoin(
      this.profilesService.deleteRecord(teacher.profile_id),
      this.teachersService.deleteRecord(teacher.id),
      this.coursesService.getAllCoursesOfTeacher(teacher.id)
        .switchMap((courses: string[]) => this.coursesService.deleteTeacherFromCourses(teacher.id, courses)))
      .switchMap(() => {
        return Observable.forkJoin(
          this.profilesService.getRecords(),
          this.teachersService.getRecords(),
          this.coursesService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Teacher ${teacher.id} was deleted`, duration: 3000});
            this.profilesService.emit();
            this.teachersService.emit();
            this.coursesService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error deleting teacher ${teacher.id}: ${error.message}`});
        return Observable.of(false);
      })
  }

  /**
   * Deletes a Course and pushes an Alert based on the response and returns true or false based on success.
   * @param {Course} course: the course to be deleted
   * @returns {Observable<boolean>}
   */
  deleteCourse(course: Course): Observable<boolean> {
    return Observable.forkJoin(
      this.studentsService.removeCurseFromStudents(course.id, course.students ? course.students : []),
      this.coursesService.deleteRecord(course.id))
      .switchMap(() => {
        return Observable.forkJoin(
          this.studentsService.getRecords(),
          this.coursesService.getRecords())
          .map(() => {
            this.alertService.pushAlert(
              {type: "success", message: `Course ${course.id} was deleted`, duration: 3000});
            this.studentsService.emit();
            this.coursesService.emit();
            return true;
          })
      })
      .catch((error: any) => {
        this.alertService.pushAlert(
          {type: "danger", message: `Error deleting course ${course.id}: ${error.message}`});
        return Observable.of(false);
      })
  }

}
