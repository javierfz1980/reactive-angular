import {RouteElement} from "./models/core/route-element";
import {contentRoutePaths} from "./content/content-routes";

/**
 * Predefined Routes
 * @type {{posts: string; post: string}}
 */
export const appRoutePaths: {[key:string]: RouteElement} = {
  login: {path: "login", icon: "info-circle"},
  ...contentRoutePaths
};
