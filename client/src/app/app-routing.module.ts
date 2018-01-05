import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from './content/dashboard/dashboard.component';
/*import {PostsComponent} from "./posts/posts.component";
import {SinglePostComponent} from "./posts/single-post/single-post.component";*/

/**
 * Predefined Routes
 * @type {{posts: string; post: string}}
 */
export const routePaths = {
  dashboard: "dashboard",
  alumnos: "alumnos",
  cursos: "cursos",
  profesores: "profesores",

}

/**
 * Routing strategy:
 * posts/ -> loads PostsComponent
 * post/:id -> loads single Post
 * post/ -> since there is no Id will load /posts
 * anything else -> loads PostsComponent
 * @type {[{path: string; component: PostsComponent},{path: string; component: PostComponent; children: [{path: string; component: PostComponent},{path: string; redirectTo: string; pathMatch: string}]},{path: string; redirectTo: string; pathMatch: string}]}
 */
const appRoutes: Routes = [
  {path: routePaths.dashboard, component: DashboardComponent},
  {path: "**", redirectTo: routePaths.dashboard, pathMatch: "full"}

  /*{path: routePaths.posts, component: PostsComponent},
  {path: routePaths.post, component: SinglePostComponent, children: [
    {path: ":id", component: SinglePostComponent},
    {path: "", redirectTo: "/"+routePaths.posts, pathMatch: "full"}
  ]},
  {path: "**", redirectTo: routePaths.posts, pathMatch: "full"},*/
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
