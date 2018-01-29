import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {StudentsService} from "./content/students.service";
import {TeachersService} from "./content/teachers.service";
import {CoursesService} from "./content/courses.service";
import {StoreData} from "../../../models/core/store-data";
import {Student} from "../../../models/content/student";
import {Course} from "../../../models/content/course";
import {Teacher} from "../../../models/content/teacher";
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';

@Injectable()
export class SearchService {

  constructor(private studentsService: StudentsService,
              private teachersService: TeachersService,
              private coursesService: CoursesService) {}

  searchStudents(data: string): Observable<StoreData<Student>> {
    return this.studentsService.searchRecords(data)
      .map((data: Student[]) => ({
        data: data,
        loading: false
      }))
      .startWith({
        data: null,
        loading: true
      })
  }

  searchTeachers(data: string): Observable<StoreData<Teacher>> {
    return this.teachersService.searchRecords(data)
      .map((data: Teacher[]) => ({
        data: data,
        loading: false
      }))
      .startWith({
        data: null,
        loading: true
      })
  }

  searchCourses(data: string): Observable<StoreData<Course>> {
    return this.coursesService.searchRecords(data)
      .map((data: Course[]) => ({
        data: data,
        loading: false
      }))
      .startWith({
        data: null,
        loading: true
      })
  }

}
