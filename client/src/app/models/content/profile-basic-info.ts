import {Profile} from "./profile";

export interface ProfileBasicInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_id: string;
  courses?: string[];
  profile?: Profile;
}
