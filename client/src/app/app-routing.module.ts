import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./core/components/login/login.component";
import {contentRoutesComponents} from "./content/content-routing";
import {appRoutePaths} from "./app-routes";

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
