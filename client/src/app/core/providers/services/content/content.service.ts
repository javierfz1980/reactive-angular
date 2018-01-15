import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../../models/course";

@Injectable()
export class ContentService {

  private readonly basePath: string = globalProperties.basePath;

  constructor(private httpClient: HttpClient) {}

  getContent<T>(url: string): Observable<T> {
    console.log("fetching content");
    return this.httpClient.get<T>(`${this.basePath}${url}`);
  }

  deleteContent<T>(url: string, id: string): Observable<T> {
    console.log("deleting content: ", url);
    return this.httpClient.delete<T>(`${this.basePath}${url}/${id}`);
  }

  patchContent<T>(url: string, id: string, data: {[key: string]: any}): Observable<T> {
    console.log("patching content: ", url);
    return this.httpClient.patch<T>(`${this.basePath}${url}/${id}`, data);
  }

}
