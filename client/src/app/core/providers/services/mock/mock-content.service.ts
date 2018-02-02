import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import {Course} from "../../../../models/content/course";
import {Teacher} from "../../../../models/content/teacher";
import {StoreData} from "../../../../models/core/store-data";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

/**
 * Mocked Teachers
 */
export const mockedTeachers: Teacher[] = [
  {
    id: "id 1",
    first_name: "name 1",
    last_name: "lastname 1",
    email: "email 1",
    profile_id: "id 1",
  },
  {
    id: "id 2",
    first_name: "name 2",
    last_name: "lastname 2",
    email: "email 2",
    profile_id: "id 2",
  },
  {
    id: "id 3",
    first_name: "name 3",
    last_name: "lastname 3",
    email: "email 3",
    profile_id: "id 3",
  },
  {
    id: "id 4",
    first_name: "name 4",
    last_name: "lastname 4",
    email: "email 4",
    profile_id: "id 4",
  },
  {
    id: "id 5",
    first_name: "name 5",
    last_name: "lastname 5",
    email: "email 5",
    profile_id: "id 5",
  }
];

/**
 * Mocked Courses
 */
export const mockedCourses: Course[] = [
  {
    id: "id 1",
    title: "title 1",
    short_description: "description 1",
    detail: "detail 1",
    active: true,
    teacher: "id 1",
    students: [],
  },
  {
    id: "id 2",
    title: "title 2",
    short_description: "description 2",
    detail: "detail 2",
    active: true,
    teacher: "id 2",
    students: [],
  },
  {
    id: "id 3",
    title: "title 3",
    short_description: "description 3",
    detail: "detail 3",
    active: true,
    teacher: "id 3",
    students: [],
  },
  {
    id: "id 4",
    title: "title 4",
    short_description: "description 4",
    detail: "detail 4",
    active: true,
    teacher: "id 4",
    students: [],
  },
  {
    id: "id 5",
    title: "title 5",
    short_description: "description 5",
    detail: "detail 5",
    active: true,
    teacher: "id 5",
    students: [],
  }
];


/**
 * Mock Service that simulates fetching data from the API.
 */
@Injectable()
export class MockContentService {

  private coursesStore: StoreData<Course> = {data: null, loading: false};
  private readonly coursesDataSubject: BehaviorSubject<StoreData<Course>> = new BehaviorSubject({data: null, loading: true});
  coursesSource: Observable<StoreData<Course>> = this.coursesDataSubject.asObservable();

  /**
   * Retrieves a mocked single Course
   */
  getCourse(postId: string): Observable<Course> {
    return Observable.of(mockedCourses[0]);
  }

  /**
   * Retrieves a mocked single Course with it Teacher.
   */
  getCourseWithTeacher(courseId: string): Observable<Course> {
    const courseWithTeacher = this.getCourse(courseId)
      .switchMap((course: Course) => this.getTeacher(course.teacher)
        .map((teacher: Teacher) => {
          course.teacherInfo = teacher;
          return course;
        }));

    return courseWithTeacher;
  }

  /**
   * Retrieves a mocked Teacher
   */
  getTeacher(teacherId: string): Observable<Teacher> {
    return Observable.of(mockedTeachers[0]);
  }

  /**
   * Retrieves a store data of a list of Courses
   */
  getCourses(asSubscriber = false): Observable<StoreData<Course>> {
    return this.coursesSource;
  }

  /**
   * Fetches the mocked Courses data and emits
   */
  fetchCourses() {
    this.coursesDataSubject.next({data: mockedCourses, loading: false})
  }

}
