import {Student} from "./student";
import {Teacher} from "./teacher";

export interface Course{
  id: string;
  title: string;
  short_description: string;
  detail: string;
  active: boolean;
  teacher: string;
  students: Student[];
  teacherInfo?: Teacher;
}
