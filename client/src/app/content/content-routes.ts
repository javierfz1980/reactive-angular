import {RouteElement} from "../models/core/route-element";
import {contentCoursesRoutePaths} from "./courses/courses-routes";
import {contentStudentsRoutePaths} from "./students/students-routes";
import {contentTeachersRoutePaths} from "./teachers/teachers-routes";

/**
 * Predefined Routes for Content Module
 * @type {{posts: string; post: string}}
 */
export const contentRoutePaths: {[key:string]: RouteElement} = {
  dashboard: {path: "dashboard", icon: "dashboard"},
  courses: {path: "courses", icon: "library", childs: contentCoursesRoutePaths},
  students: {path: "students", icon: "happy-face", childs: contentStudentsRoutePaths},
  teachers: {path: "teachers", icon: "sad-face", childs: contentTeachersRoutePaths},

};
