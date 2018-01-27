import {Injectable} from "@angular/core";
import {Profile} from "../../../../models/content/profile";
import {globalProperties} from "../../../../../environments/properties";
import {BasicContentService} from "./basic-content.service";

@Injectable()
export class ProfilesService extends BasicContentService<Profile> {

  private basePath: string = globalProperties.basePath;
  path: string = `${this.basePath}${globalProperties.profilesPath}`;

}
