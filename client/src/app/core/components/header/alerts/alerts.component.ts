import {Component, ViewChild} from "@angular/core";
import {AlertsModalComponent} from "./alerts-modal/alerts-modal.component";
import {Alert} from "../../../../models/core/alert";
import {AlertService} from "../../../providers/services/alert.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: "gl-alerts",
  templateUrl: "./alerts.component.html",
  styleUrls: ["./alerts.component.css"]
})
export class AlertsComponent {

  @ViewChild("alertsModal")
  alertsModal: AlertsModalComponent;

  alerts: Observable<Alert[]>;
  unreadeAlerts: Observable<number>;
  modalData: Alert;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alerts = this.alertService
      .getAlerts();

    this.unreadeAlerts = this.alerts
      .map((alerts: Alert[]) => alerts
        .filter((alert: Alert) => !alert.read)
        .length)

  }

  openAlertsModal(alert: Alert) {
    this.alertService.markAsRead(alert);
    this.modalData = alert;
    this.alertsModal.open();
  }

  markAllAsRead() {
    this.alertService.markAsRead();
  }

  deleteAll() {
    this.alertService.removeAlert();
  }

  deleteRead() {
    this.alertService.removeRead();
  }
}
