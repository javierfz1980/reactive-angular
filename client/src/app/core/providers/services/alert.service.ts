import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Alert, AlertType} from "../../../models/core/alert";
import {Observable} from "rxjs/Observable";
import { v4 as uuid } from 'uuid';

@Injectable()
export class AlertService {

  private path: string = "";
  private data: Alert[] = [];
  private readonly dataSubject: BehaviorSubject<Alert[]> = new BehaviorSubject(this.data);
  private alerts: Observable<Alert[]> = this.dataSubject.asObservable();

  pushAlert(data: Alert) {
    if (!data.id) data.id = uuid();
    if (!data.date) data.date = new Date().toString();
    this.data.push(data);
    this.dataSubject.next(this.data.slice());
  }

  removeAlert(data: Alert) {
    this.data.forEach((alert: Alert, idx: number) => {
      if (alert.id === data.id) this.data.splice(idx,1);
    });
    this.dataSubject.next(this.data.slice());
  }

  getAlerts(): Observable<Alert[]> {
    return this.alerts;
  }

}
