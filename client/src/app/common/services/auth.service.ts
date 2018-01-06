import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import {LoginCredentials} from "../models/login-credentials";
import {HttpClient} from "@angular/common/http";
import {globalProperties} from "../../../environments/properties";
import {Observable} from "rxjs/Observable";
import {Token} from "../models/token";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import {Account} from "../models/account";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class AuthService {

  private readonly tokenKey: string = globalProperties.tokenKey;
  private readonly basePath: string = globalProperties.basePath;
  private readonly loginPath: string = globalProperties.loginPath;
  private readonly accountPath: string = globalProperties.accountPath;
  private readonly administratorKey: string = globalProperties.administratorKey;

  private authEmitter = new BehaviorSubject(false);
  private account: Account;

  constructor(private localStorageService: LocalStorageService,
              private httpClient: HttpClient) {}

  private setToken(token: string) {
    this.localStorageService.setItem(this.tokenKey, JSON.stringify({ token: token}));
    this.authEmitter.next(true);
  }

  private deleteToken() {
    this.localStorageService.removeItem(this.tokenKey);
    this.authEmitter.next(false);
  }

  getToken(): string {
    const res: string = this.localStorageService.getItem(this.tokenKey);
    return (res) ? JSON.parse(res).token : null;
  }

  isAuthorized(): boolean {
    const res: boolean = this.getToken() !== null;
    this.authEmitter.next(res);
    return res;
  }

  isAuthorized$(): Observable<boolean> {
    return this.authEmitter.asObservable();
  }

  isAdministrator(): Observable<boolean> {
    if (this.account) {
      return Observable.of(this.isAuthorized() && this.account.role === this.administratorKey);
    } else {
      return this.getAccount()
        .map((account: Account) => this.isAuthorized() && account.role === this.administratorKey)
    }
  }

  getAccount(): Observable<Account> {
    return this.httpClient.get<Account>(this.basePath + this.accountPath)
      .do((account: Account) => {
        this.account = account
      })
  }

  login(data: LoginCredentials): Observable<Token> {
    return this.httpClient.post(this.basePath + this.loginPath, data)
      .do((response: Token) => this.setToken(response.token))
      .catch((error: any) => Observable.throw(error));
  }

  logout() {
    this.deleteToken();
    this.account = null;
    this.authEmitter.next(false);
  }

}
