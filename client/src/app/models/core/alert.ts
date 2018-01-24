import { v4 as uuid } from 'uuid';

export type AlertType = "info" | "warning" | "success" | "danger" | "MESSAGE_RECIEVED";
export interface Alert {
  id?: uuid;
  type: AlertType;
  message: String;
  from?: String;
  email?: String;
  date?: String;
  duration?: number;
  read?: boolean;
}
