import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Teacher} from "../../../../models/content/teacher";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/content/profile";
import {Course} from "../../../../models/content/course";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/observable/empty';

@Injectable()
export class TeachersService {

  private path: string = globalProperties.teachersPath;
  private profilesPath: string = globalProperties.profilesPath;
  private coursesPath: string = globalProperties.coursesPath;

  /**
   * Internal service data
   */
  private data: Teacher[] = [];

  /**
   * Internal service data emitter
   */
  private readonly studentsSubject: BehaviorSubject<Teacher[]> = new BehaviorSubject(this.data);
  teachers: Observable<Teacher[]> = this.studentsSubject.asObservable();

  constructor(private contentService: ContentService) {}

  /**
   * Fetches all Teachers or an individual Teacher from server, saves the data internally and emits.
   * @param {string} id: The id of the Student to be fetched
   */
  fetchData(id?: string) {
    if (id) {
      return this.contentService
        .getContent<Teacher>(`${this.path}/${id}`)
        .subscribe((teacher: Teacher) => {
          if (this.data.length > 0) {
            this.data.forEach((teacherData, idx) => {
              if (teacherData.id === id) this.data[idx] = teacher;
            })
          } else {
            this.data.push(teacher);
          }
          this.studentsSubject.next(this.data.slice());
        })
    } else {
      return this.contentService
        .getContent<Teacher[]>(this.path)
        .subscribe((teachers: Teacher[]) => {
          this.data = teachers;
          this.studentsSubject.next(this.data.slice());
        })
    }
  }

  /**
   * Creates a new Teacher and returns a ContentAlert based on the response.
   * @param {Student} teacher: Teacher basic info
   * @param {Profile} profile: Student Profile info
   * @param {string[]} courses: The selected courses for the Student to be registered.
   * @returns {Observable<ContentAlert>}
   */
  createData(teacher: Teacher, profile: Profile, courses: string[]): Observable<ContentAlert> {
    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
        this.contentService.postContent<Profile>(this.profilesPath, profile),
        this.contentService.postContent<Teacher>(this.path, teacher)
      )
      .switchMap(([newProfile, newTeacher]) => {
        return Observable.forkJoin(
          this.contentService.patchContent<Teacher>(this.path, newTeacher.id, {profile_id: newProfile.id}),
          this.addTeacherToCourses(newTeacher.id, courses))
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
      })
  }

  /**
   * Updates a Teacher and returns a ContentAlert based on the response.
   * @param {Student} teacher: Student basic info
   * @param {Profile} profile: Student Profile info
   * @param {string[]} coursesToBeRemoved: The list of Courses where Teacher should be removed
   * @param {string[]} coursesToBeAdded: The list of Courses where Teacher should be added.
   * @returns {Observable<ContentAlert>}
   */
  updateData(teacher: Teacher, profile: Profile, coursesToBeRemoved: string[],
             coursesToBeAdded: string[]): Observable<ContentAlert> {
    const teacherId: string = teacher.id;
    const profileId: string = profile.id;

    delete teacher.id;
    delete profile.id;

    profile.birthday = new Date(profile.birthday).toString();

    return Observable.forkJoin(
      this.contentService.patchContent<Teacher>(this.path, teacherId, teacher),
      this.contentService.patchContent<Profile>(this.profilesPath, profileId, profile),
      this.updateTeacherCourses(teacherId, coursesToBeRemoved, coursesToBeAdded))
      .do(() => this.fetchData())
      .map(() => (<ContentAlert>{
        type: "success",
        message: "Teacher info updated",
        time: 3000
      }))
      .catch((error: any) => Observable.of(<ContentAlert>{
        type: "danger",
        message: `Error updating info: ${error.message}`
      }))
  }

  /**
   * Deletes a Teacher and returns a ContentAlert based on the response.
   * @param {Teacher} teacher: The Teacher to be deleted
   * @returns {Observable<ContentAlert>}
   */
  deleteData(teacher: Teacher): Observable<ContentAlert> {
    return Observable.forkJoin(
      this.contentService.deleteContent<MessageResponse>(this.profilesPath, teacher.profile_id),
      this.contentService.deleteContent<MessageResponse>(this.path, teacher.id),
      this.deleteTeacherFromAllCourses(teacher.id))
      .do(() => this.fetchData())
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
   * Fetches and returns all the Courses assigned to a Teacher
   * @param {string} teacherId: The id of the teacher to fetch Courses
   * @returns {Observable<Course[]>}
   */
  getTeacherCourses(teacherId: string): Observable<Course[]> {
    return this.contentService.getContent<Course[]>(this.coursesPath)
      .map((courses: Course[]) => courses.filter((course: Course) => course.teacher === teacherId));
  }


  /**
   * Updates the Courses where an Teacher is registered or not.
   * @param {string} teacherId: The Teacher id
   * @param {string[]} coursesToBeRemoved: The list of Courses where Teacher should be removed
   * @param {string[]} coursesToBeAdded: The list of Courses where Teacher should be added
   * @returns {Observable<Course[]>}
   */
  private updateTeacherCourses(teacherId: string, coursesToBeRemoved: string[],
                               coursesToBeAdded: string[]): Observable<Course[]> {
    return this.deleteTeacherFromCourses(teacherId, coursesToBeRemoved)
      .switchMap(() => this.addTeacherToCourses(teacherId, coursesToBeAdded));
  }

  /**
   * Adds/registers a Teacher to a list of Courses.
   * @param {string} teacherId: The Teacher id
   * @param {string[]} courses: The list of Courses where Student should be added
   * @returns {Observable<Course[]>}
   */
  private addTeacherToCourses(teacherId: string, courses: string[]): Observable<Course[]> {
    if (courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => {
        return this.contentService
          .patchContent<Course>(this.coursesPath, courseId, {teacher: teacherId})
      })
      .toArray();
  }

  /**
   * Removes a Teacher to a list of Courses.
   * @param {string} teacherId: The Teacher id
   * @param {string[]} courses: The list of Courses where Student should be removed
   * @returns {Observable<Course[]>}
   */
  private deleteTeacherFromCourses(teacherId: string, courses: string[]): Observable<Course[]> {
    if (courses.length === 0) return Observable.of([]);
    return Observable.from(courses)
      .mergeMap((courseId: string) => {
        return this.contentService
          .patchContent<Course>(this.coursesPath, courseId, {teacher: null})
      })
      .toArray();
  }

  /**
   * Deletes a Teacher from all its assigned Courses
   * @param {string} teacherId: The of the Teacher
   * @returns {Observable<Course[]>}
   */
  private deleteTeacherFromAllCourses(teacherId: string): Observable<Course[]> {
    return this.getTeacherCourses(teacherId)
      .switchMap((courses: Course[]) => {
        return this.deleteTeacherFromCourses(teacherId, courses.map(course => course.id))
      });
  }


}
