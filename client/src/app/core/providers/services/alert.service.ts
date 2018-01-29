import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Alert} from "../../../models/core/alert";
import {Observable} from "rxjs/Observable";
import { v4 as uuid } from 'uuid';
import {globalProperties} from "../../../../environments/properties";

/**
 * This service will store all internal notifications (system actions alerts responses -
 * delete, create, update) and all external alerts (web socket alerts).
 * After avery change on its internal data, the internal subject will emit a new stream of alerts to
 * all subscribers.
 */
@Injectable()
export class AlertService {

  private path: string = globalProperties.basePathWs;
  private data: Alert[] = [];
  private readonly dataSubject: BehaviorSubject<Alert[]> = new BehaviorSubject(this.data);
  private socket: WebSocket;

  /**
   * Creates the service and connects to the web socket
   */
  constructor() {
    this.socket = new WebSocket(this.path);
    this.socket.onmessage = (msg) => {
      const data: Alert[] = JSON.parse(msg.data);
      if (data.length > 0) data.map((alert: Alert) => this.pushAlert(alert));
    };

    this.socket.onerror = (msg) => {
      console.log("ws error: ", msg)
    };

    this.socket.onclose = (msg) => {
      console.log("ws closed: ", msg)
    };
  }

  /**
   * Push an Alert to its internal data and emits.
   * @param {Alert} data
   */
  pushAlert(data: Alert) {
    if (!data.id) data.id = uuid();
    if (!data.date) data.date = new Date().toString();
    this.data.push(data);
    this.emit();
  }

  /**
   * Removes Alerts from its internal data. Id no data is specified it will delete all internal
   * data and emits.
   * @param {Alert} data
   */
  removeAlert(data?: Alert) {
    if (data) {
      this.data.forEach((alert: Alert, idx: number) => {
        if (alert.id === data.id) this.data.splice(idx,1);
      });
    } else {
      this.data.length = 0;
    }
    this.emit();
  }

  /**
   * Removes read Alerts from internal data and emits.
   */
  removeRead() {
    this.data = this.data.filter((dataAlert: Alert) => !dataAlert.read);
    this.dataSubject.next(this.data.slice());
  }

  /**
   * Marks Alerts as read. If no Alert is specified it will mark all internal data Alerts as read
   * and it will emit.
   * @param {Alert} alert
   */
  markAsRead(alert?: Alert) {
    if (alert) {
      this.data.find((dataAlert: Alert) => dataAlert.id === alert.id).read = true;
    } else {
      this.data.map((dataAlert: Alert) => dataAlert.read = true);
    }
    this.emit();
  }

  /**
   * Return internal Subject as an Observable to be subscribed to.
   * @returns {Observable<Alert[]>}
   */
  getAlerts(): Observable<Alert[]> {
    return this.dataSubject.asObservable();
  }

  /**
   * Emits an stream with a copy of the internal data.
   */
  private emit() {
    this.dataSubject.next(this.data.slice());
  }

}
