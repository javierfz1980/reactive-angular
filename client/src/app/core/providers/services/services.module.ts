import {ModuleWithProviders, NgModule} from "@angular/core";
import {AuthService} from "./auth.service";
import {LocalStorageService} from "./local-storage.service";
import {ContentService} from "./content/content.service";
import {StudentsService} from "./content/students.service";
import {TeachersService} from "./content/teachers.service";
import {CoursesService} from "./content/courses.service";
import {ProfilesService} from "./content/profiles.service";

export const services = [
  AuthService,
  LocalStorageService,
  ContentService,
  StudentsService,
  TeachersService,
  CoursesService,
  ProfilesService
];

@NgModule()
export class ServicesModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [...services]
    };
  }

}
