import {Injectable} from "@angular/core";
import {MessageResponse} from "../../../../models/api/message-response";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {getFakedDelay} from "../../../../helpers/helpers";
import 'rxjs/add/operator/delay';

export interface StoreData<T> {
  data: T[];
  loading: boolean;
}
/**
 * Basic generic abstract class with basic api actions that should be extended by any entity service.
 * This implementation has an internal data store with a list and a loading boolean. It also have a
 * Behavior subject that emits every time that the internal data is refreshed.
 * Every component subscribed to this subject will receive a stream with the new data on every change.
 * Every service class that extends from this one should expose the internal subject as observable to allow
 * components to subscribe to the internal data changes. Ex:
 *
 * - public data = this.dataSubject.asObservable();
 * - this.dataSubject.next(storeData);
 * -
 * - data.subscribe();
 *
 */
@Injectable()
export abstract class BasicContentService<T> {

  abstract path: string;
  private store: StoreData<T> = {data: null, loading: false};
  private readonly dataSubject: BehaviorSubject<StoreData<T>> = new BehaviorSubject(this.store);
  source: Observable<StoreData<T>> = this.dataSubject.asObservable();

  constructor(protected httpClient: HttpClient) {}

  /**
   * Fetches all records or an individual record from server, saves the data internally and emits.
   * @param {string} id: The id of the Entity to be fetched
   * @returns {Observable<T[]>}
   */
  fetchData(id?: string) {
    this.emit(true);

    if (id) {
      this.getRecord(id).subscribe(() => this.emit());
    } else {
      this.getRecords().subscribe(() => this.emit());
    }
  }

  /**
   * Fetches and returns a list of records from server.
   * @returns {Observable<T[]>}
   */
  getRecords(): Observable<T[]> {
    return this.httpClient
      .get<T[]>(this.path)
      .delay(getFakedDelay())
      .map((stream: T[]) => {
        this.store.data = stream;
        return stream;
      });
  }

  /**
   * Fetches and returns a single record from server.
   * @param {string} id
   * @returns {Observable<T>}
   */
  getRecord(id: string): Observable<T> {
    return this.httpClient
      .get<T>(`${this.path}${id}`)
      .delay(getFakedDelay())
      .map((stream: T) => {
        if (this.store.data && this.store.data.length > 0) {
          let patched: boolean = false;
          this.store.data.forEach((internalData: T, idx) => {
            if (internalData["id"] === id) {
              this.store.data[idx] = stream;
              patched = true;
            }
          });
          if (!patched) this.store.data.push(stream);
        } else {
          this.store.data = [stream];
        }
        return stream;
      });
  }

  /**
   * Creates a new record on the server and on the internal data and returns the new created record.
   * @param {T} data
   * @returns {Observable<T>}
   */
  createRecord(data: T): Observable<T> {
    return this.httpClient
      .post<T>(this.path, data)
      .delay(getFakedDelay());
  }

  /**
   * Updates an existing record from server and from internal data and returns the updated record.
   * @param {string} id
   * @param {{[p: string]: any}} data
   * @returns {Observable<T>}
   */
  updateRecord(id: string, data: {[key: string]: any}): Observable<T> {
    return this.httpClient
      .patch<T>(`${this.path}${id}`, data)
      .delay(getFakedDelay());
  }

  /**
   * Deletes a record from server and from internal data and returns the response.
   * @param {string} id
   * @returns {Observable<MessageResponse>}
   */
  deleteRecord(id: string): Observable<MessageResponse> {
    return this.httpClient
      .delete<MessageResponse>(`${this.path}${id}`)
      .delay(getFakedDelay());
  }

  /**
   * Emits an stream with a copy of the internal data.
   */
  emit(isLoading?: boolean) {
    this.store.loading = isLoading ? isLoading : false;
    console.log(`${this.constructor.name}: has emitted... <${this.store.loading}`);
    this.dataSubject.next(Object.assign({}, this.store));
  }

}
