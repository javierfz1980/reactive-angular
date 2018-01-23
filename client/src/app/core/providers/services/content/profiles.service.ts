import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Profile} from "../../../../models/content/profile";
import {globalProperties} from "../../../../../environments/properties";
import {BasicContentService} from "./basic-content.service";

@Injectable()
export class ProfilesService extends BasicContentService<Profile> {

  private basePath: string = globalProperties.basePath;
  protected path: string = `${this.basePath}${globalProperties.profilesPath}`;
  teachers: Observable<Profile[]> = this.dataSubject.asObservable();

}
