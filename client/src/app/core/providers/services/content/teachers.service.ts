import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {Teacher} from "../../../../models/content/teacher";
import {BasicContentService} from "./basic-content.service";
import 'rxjs/add/observable/empty';

@Injectable()
export class TeachersService extends BasicContentService<Teacher> {

  private basePath: string = globalProperties.basePath;
  path: string = `${this.basePath}${globalProperties.teachersPath}`;

}
