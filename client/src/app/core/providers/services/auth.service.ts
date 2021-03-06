import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import {LoginCredentials} from "../../../models/api/login-credentials";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {globalProperties} from "../../../../environments/properties";
import {Observable} from "rxjs/Observable";
import {Token} from "../../../models/api/token";
import {Account} from "../../../models/core/account";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {getFakedDelay} from "../../../helpers/helpers";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/switchMap";
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {

  private readonly tokenKey: string = globalProperties.tokenKey;
  private readonly basePath: string = globalProperties.basePath;
  private readonly loginPath: string = globalProperties.loginPath;
  private readonly accountPath: string = globalProperties.accountPath;
  private readonly administratorKey: string = globalProperties.administratorKey;

  private _account: Account;
  private readonly _accountSubject: BehaviorSubject<Account> = new BehaviorSubject(this._account);
  account: Observable<Account> = this._accountSubject.asObservable();

  private readonly _authEmitter = new BehaviorSubject(false);
  isUserAuthorized: Observable<boolean> = this._authEmitter.asObservable();

  constructor(private localStorageService: LocalStorageService,
              private httpClient: HttpClient) {
    this._authEmitter.next(this.isAuthorized());
  }

  private setToken(token: string) {
    this.localStorageService.setItem(this.tokenKey, JSON.stringify({ token: token}));
    this._authEmitter.next(this.isAuthorized())
  }

  private deleteToken() {
    this.localStorageService.removeItem(this.tokenKey);
    this._authEmitter.next(this.isAuthorized())
  }

  private fetchAccount(token: string): Observable<Account>  {
    const headers = new HttpHeaders({'Token': token});
    return this.httpClient
      .get<Account>(`${this.basePath}${this.accountPath}`, {headers: headers})
      .delay(getFakedDelay())
      .map((account: Account) => {
        this._account = account;
        this._accountSubject.next(this._account);
        this.setToken(token);
        return account;
      })
  }

  getAccount(): Account {
    return this._account;
  }

  getToken(): string {
    const res: string = this.localStorageService.getItem(this.tokenKey);
    return (res) ? JSON.parse(res).token : null;
  }

  isAuthorized(): boolean {
    return this.getToken() !== null;
  }

  isAdministrator(): boolean {
    return (this.isAuthorized() && this._account && this._account.role === this.administratorKey);
  }

  loginByToken(): Observable<boolean> {
    return this.fetchAccount(this.getToken())
      .map((account: Account) => account ? true : false)
      .catch((error: any) => Observable.throw(error))
  }

  login(data: LoginCredentials): Observable<Account> {
    return this.httpClient
      .post<Token>(`${this.basePath}${this.loginPath}`, data)
      .switchMap((response: Token) => this.fetchAccount(response.token))
      .catch((error: any) => Observable.throw(error));
  }

  logout() {
    this.deleteToken();
    this._account = null;
    this._accountSubject.next(this._account);
  }

}
