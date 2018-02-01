import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {RouteElement} from "../../../../models/core/route-element";
import {appRoutePaths} from "../../../../app-routes";

@Component({
  selector: "gl-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent implements OnInit {

  routes: RouteElement[] = [];

  ngOnInit() {
    // Fetches the routes object and converts them to an itrable Array for the template.
    for(var key in appRoutePaths) {
      if(appRoutePaths.hasOwnProperty(key) && key !== "login") {
        this.routes.push(appRoutePaths[key]);
      }
    }
  }

}
