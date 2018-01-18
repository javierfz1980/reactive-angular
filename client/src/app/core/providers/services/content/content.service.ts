import {Injectable} from "@angular/core";
import {globalProperties} from "../../../../../environments/properties";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Course} from "../../../../models/content/course";

@Injectable()
export class ContentService {

  private readonly basePath: string = globalProperties.basePath;

  constructor(private httpClient: HttpClient) {}

  getContent<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(`${this.basePath}${url}`);
  }

  deleteContent<T>(url: string, id: string): Observable<T> {
    return this.httpClient.delete<T>(`${this.basePath}${url}/${id}`);
  }

  patchContent<T>(url: string, id: string, data: {[key: string]: any}): Observable<T> {
    return this.httpClient.patch<T>(`${this.basePath}${url}/${id}`, data);
  }

  postContent<T>(url: string, data: T): Observable<T> {
    return this.httpClient.post<T>(`${this.basePath}${url}`, data);
  }

}
