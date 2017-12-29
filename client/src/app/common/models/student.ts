import {Course} from "./course";

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_id: string;
  courses: Course[];
}
