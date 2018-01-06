import {Injectable} from "@angular/core";
import {globalProperties} from "../../../environments/properties";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Course} from "../models/course";

@Injectable()
export class ContentService {

  private readonly basePath: string = globalProperties.basePath;
  private readonly coursesPath: string = globalProperties.coursesPath;

  constructor(private httpClient: HttpClient) {}

  getContent<T>(url: string): Observable<T> {
    console.log("fetching content");
    return this.httpClient.get<T>(url);
  }

}
