import {Course} from "./course";
import {Student} from "./student";
import {Profile} from "./profile";

export interface Teacher {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_id?: string;
}


export interface TeacherInfo {
  info: Student;
  profile: Profile;
  courses?: Course[];
}
