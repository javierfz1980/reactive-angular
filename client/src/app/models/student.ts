import {Course} from "./course";
import {Profile} from "./profile";

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_id: string;
  courses: string[];
}

export interface StudentInfo {
  info: Student;
  profile: Profile;
  courses: Course[];
}
