import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import {LoginCredentials} from "../models/login-credentials";
import {HttpClient} from "@angular/common/http";
import {globalProperties} from "../../../environments/properties";
import {Observable} from "rxjs/Observable";
import {Token} from "../models/token";
import 'rxjs/add/operator/catch';
import {Account} from "../models/account";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class AuthService {

  private readonly tokenKey: string = globalProperties.tokenKey;
  private readonly basePath: string = globalProperties.basePath;
  private readonly loginPath: string = globalProperties.loginPath;
  private readonly administratorKey: string = globalProperties.administratorKey;

  private authSubject = new BehaviorSubject(false);
  private account: Account;

  constructor(private localStorageService: LocalStorageService,
              private httpClient: HttpClient) {}

  private setToken(token: string) {
    this.localStorageService.setItem(this.tokenKey, JSON.stringify({ token: token}));
  }

  private deleteToken() {
    this.localStorageService.removeItem(this.tokenKey);
  }

  getToken(): string {
    const res: string = this.localStorageService.getItem(this.tokenKey);
    return (res) ? JSON.parse(res).token : null;
  }

  isAuthorized(): boolean {
    const res: boolean = this.getToken() !== null;
    this.authSubject.next(res);
    return res;
  }

  isAdministrator(): boolean {
    return this.isAuthorized() && this.account.role === this.administratorKey;
  }

  login(data: LoginCredentials): Observable<Token> {
    const url: string = this.basePath + this.loginPath;
    return this.httpClient.post(url, data)
      .map((response: Token) => {
        this.setToken(response.token);
        this.authSubject.next(this.isAuthorized());
      })
      .catch((error: any) => Observable.throw(error))
  }

  logout() {
    this.deleteToken();
    this.account = null;
    this.authSubject.next(false);
  }

  getAuthState(): Observable<boolean> {
    return this.authSubject.asObservable();
  }


}
