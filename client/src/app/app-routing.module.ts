import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./core/components/login/login.component";
import {RouteElement} from "./models/route-element";
import {contentRoutePaths, contentRoutesComponents} from "./content/content-routing";

/**
 * Predefined Routes
 * @type {{posts: string; post: string}}
 */
export const appRoutePaths: {[key:string]: RouteElement} = {
  login: {path: "login", icon: "info-circle"},
  ...contentRoutePaths
};

const appRoutesComponents: Routes = [
  {path: appRoutePaths.login.path, component: LoginComponent},
  ...contentRoutesComponents,
  {path: "**", redirectTo: appRoutePaths.dashboard.path, pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutesComponents)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
