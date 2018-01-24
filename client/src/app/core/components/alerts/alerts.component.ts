import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Alert} from "../../../models/core/alert";
import {AlertService} from "../../providers/services/alert.service";

@Component({
  selector: "gl-alerts",
  templateUrl: "./alerts.component.html"
})
export class AlertsComponent implements OnInit {

  alerts: Observable<Alert[]>;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alerts = this.alertService
      .getAlerts()
      .map((alerts: Alert[]) => alerts
        .filter((alert: Alert) => alert.type !== "MESSAGE_RECIEVED" && !alert.read))
  }
}
