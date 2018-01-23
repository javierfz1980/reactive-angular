import {Injectable} from "@angular/core";
import {MessageResponse} from "../../../../models/api/message-response";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

/**
 * Basic generic abstract class with basic api actions that should be extended by any entity service.
 * This implementation has an internal data list and a Behavior subject that emits every time that
 * the internal data change. Every component subscribed to this subject will receive a stream with
 * the new data on every change.
 * Every service class that extends from this one should expose the internal subject as observable to allow
 * components to subscribe to the internal data changes. Ex:
 *
 * - public data = this.dataSubject.asObservable();
 * - this.dataSubject.next([]);
 * -
 * - data.subscribe();
 *
 */
@Injectable()
export abstract class BasicContentService<T> {

  protected path: string = "";
  protected data: T[] = [];
  protected readonly dataSubject: BehaviorSubject<T[]> = new BehaviorSubject(this.data);

  constructor(protected httpClient: HttpClient) {}

  /**
   * Fetches all records or an individual record from server, saves the data internally and emits.
   * @param {string} id: The id of the Entity to be fetched
   */
  fetchData(id?: string) {
    if (id) {
      return this.getRecord(id)
        .subscribe((data: T) => {
          if (this.data.length > 0) {
            this.data.forEach((studentData: T, idx) => {
              if (studentData["id"] === id) this.data[idx] = data;
            })
          } else {
            this.data.push(data);
          }
          this.dataSubject.next(this.data.slice());
        })
    }
    return this.getRecords()
      .subscribe((students: T[]) => {
        this.data = students;
        this.dataSubject.next(this.data.slice());
      })
  }

  /**
   * Fetches and returns a list of records
   * @returns {Observable<T[]>}
   */
  getRecords(): Observable<T[]> {
    return this.httpClient
      .get<T[]>(this.path);
  }

  /**
   * Fetches and returns a single record
   * @param {string} id
   * @returns {Observable<T>}
   */
  getRecord(id: string): Observable<T> {
    return this.httpClient
      .get<T>(`${this.path}${id}`);
  }

  /**
   * Creates a new record and returns the response
   * @param {T} data
   * @returns {Observable<T>}
   */
  createRecord(data: T): Observable<T> {
    return this.httpClient
      .post<T>(this.path, data);
  }

  /**
   * Updates an existing record and returns the response
   * @param {string} id
   * @param {{[p: string]: any}} data
   * @returns {Observable<T>}
   */
  updateRecord(id: string, data: {[key: string]: any}): Observable<T> {
    return this.httpClient
      .patch<T>(`${this.path}${id}`, data);
  }

  /**
   * Deletes a record an returns the response
   * @param {string} id
   * @returns {Observable<MessageResponse>}
   */
  deleteRecord(id: string): Observable<MessageResponse> {
    return this.httpClient
      .delete<MessageResponse>(`${this.path}${id}`);
  }

}
