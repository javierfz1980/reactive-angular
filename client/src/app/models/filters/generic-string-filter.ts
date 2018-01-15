import {Student} from "../content/student";
import {Teacher} from "../content/teacher";

export interface GenericStringFilter<T> {
  accepts(item: T, search: string): boolean;
}

export class NameLastnameFilter implements GenericStringFilter<Student | Teacher>{
  accepts(student: Student | Teacher, search: string):boolean {
    return student.first_name.toLowerCase().indexOf(search) >= 0;
  }
}

export class EmailFilter implements GenericStringFilter<Student | Teacher>{
  accepts(student: Student | Teacher, search: string):boolean {
    return student.email.toLowerCase().indexOf(search) >= 0;
  }
}
