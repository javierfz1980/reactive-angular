import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import {LoginCredentials} from "../../../models/api/login-credentials";
import {HttpClient} from "@angular/common/http";
import {globalProperties} from "../../../../environments/properties";
import {Observable} from "rxjs/Observable";
import {Token} from "../../../models/api/token";
import {Account} from "../../../models/core/account";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/switchMap";

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

  private fetchAccount(): Observable<Account>  {
    return this.httpClient
      .get<Account>(this.basePath + this.accountPath)
      .do((account: Account) => {
        this._account = account;
        this._accountSubject.next(this._account);
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
    return this.fetchAccount()
      .map((account: Account) => account ? true : false)
      .catch((error: any) => Observable.throw(error));
  }

  login(data: LoginCredentials): Observable<Token> {
    return this.httpClient
      .post<Token>(this.basePath + this.loginPath, data)
      .do((response: Token) => this.setToken(response.token))
      .switchMap(() => this.fetchAccount())
      .catch((error: any) => Observable.throw(error));
  }

  logout() {
    this.deleteToken();
    this._account = null;
    this._accountSubject.next(this._account);
  }

}
