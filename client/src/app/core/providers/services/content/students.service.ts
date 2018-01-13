import {Injectable} from "@angular/core";
import {ContentService} from "./content.service";
import {Observable} from "rxjs/Observable";
import {Student, StudentInfo} from "../../../../models/student";
import {globalProperties} from "../../../../../environments/properties";
import {MessageResponse} from "../../../../models/api/message-response";
import {ContentAlert} from "../../../../content/commons/alert/content-alert.component";
import {Profile} from "../../../../models/profile";
import {Course} from "../../../../models/course";
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';

@Injectable()
export class StudentsService {

  private path: string = globalProperties.studentsPath;

  constructor(private contentService: ContentService) {}

  getStudents(): Observable<Student[]> {
    return this.contentService
      .getContent<Student[]>(this.path);
  }

  getStudent(id: string): Observable<StudentInfo> {
    return this.contentService
      .getContent<Student>(`${this.path}/${id}`)
      .switchMap((student: Student) => {

        // once we get the student, we can parallelize the calls to get the profile and the courses.
        const profile: Observable<Profile> = this.contentService
          .getContent<Profile>(`${globalProperties.profilesPath}/${student.profile_id}`);

        const courses: Observable<Course[]> = Observable
          .from((<string[]>student.courses))
          .mergeMap((courseId: string) =>  this.contentService
            .getContent<Course>(`${globalProperties.coursesPath}/${courseId}`))
          .toArray();

        return Observable.forkJoin(profile, courses)
          .map(([profile, courses]) => ({info: student, profile: profile, courses: courses}))
      })
  }

  deleteStudent(student: Student): Observable<ContentAlert> {
    return this.contentService
      .deleteContent<MessageResponse>(this.path, student.id)
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
