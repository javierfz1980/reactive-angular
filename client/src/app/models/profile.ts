import {ContactInfo} from "./contact-info";

export interface Profile {
  id: string;
  birthday: string;
  avatar: string;
  secondary_email: string;
  contact: ContactInfo;
}
