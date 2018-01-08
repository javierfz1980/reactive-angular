import {Component} from '@angular/core';
import {routePaths} from "../../app-routing.module";
import {RouteElement} from "../../commons/models/route-element";

@Component({
  selector: "gl-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.css"]
})
export class SideNavComponent {

  /**
   * Fetches the routes object and converts them to an itrable Array for the template.
   * @returns {string[]}
   */
  getRoutes(): RouteElement[] {
    const routes: RouteElement[] = [];
    for(var key in routePaths) {
      if(routePaths.hasOwnProperty(key) && key !== "login") {
        routes.push(routePaths[key]);
      }
    }
    return routes;
  }
}
