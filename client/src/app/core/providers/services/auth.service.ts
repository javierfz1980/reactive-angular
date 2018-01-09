import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import {LoginCredentials} from "../../../models/api/login-credentials";
import {HttpClient} from "@angular/common/http";
import {globalProperties} from "../../../../environments/properties";
import {Observable} from "rxjs/Observable";
import {Token} from "../../../models/token";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/switchMap";
import {Account} from "../../../models/account";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class AuthService {

  private readonly tokenKey: string = globalProperties.tokenKey;
  private readonly basePath: string = globalProperties.basePath;
  private readonly loginPath: string = globalProperties.loginPath;
  private readonly accountPath: string = globalProperties.accountPath;
  private readonly administratorKey: string = globalProperties.administratorKey;

  private account: Account;
  authEmitter = new BehaviorSubject(false);

  constructor(private localStorageService: LocalStorageService,
              private httpClient: HttpClient) {
    this.authEmitter.next(this.isAuthorized());
  }

  private setToken(token: string) {
    this.localStorageService.setItem(this.tokenKey, JSON.stringify({ token: token}));
  }

  private deleteToken() {
    this.localStorageService.removeItem(this.tokenKey);
  }

  private fetchAccount(): Observable<Account>  {
    return this.httpClient
      .get<Account>(this.basePath + this.accountPath)
      .do((account: Account) => this.account = account)
      .do((account: Account) => console.log("account: ", account));
  }

  getAccount(): Account {
    return this.account;
  }

  getToken(): string {
    const res: string = this.localStorageService.getItem(this.tokenKey);
    return (res) ? JSON.parse(res).token : null;
  }

  isAuthorized(): boolean {
    return this.getToken() !== null;
  }

  isAdministrator(): boolean {
    return (this.isAuthorized() && this.account && this.account.role === this.administratorKey);
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
      .switchMap((response: Token) => this.fetchAccount())
      .do((account: Account) => {
        this.authEmitter.next(this.isAuthorized());
      })
      .catch((error: any) => Observable.throw(error));
  }

  logout() {
    this.deleteToken();
    this.account = null;
    this.authEmitter.next(this.isAuthorized());
  }

}
