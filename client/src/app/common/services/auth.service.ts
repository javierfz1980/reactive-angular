import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import {LoginCredentials} from "../models/login-credentials";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Token} from "../models/token";
import {globalProperties} from "../../../environments/properties";

@Injectable()
export class AuthService {

  private readonly tokenKey: string = globalProperties.tokenKey;
  private readonly basePath: string = globalProperties.basePath;
  private readonly loginPath: string = globalProperties.loginPath;

  constructor(private localStorageService: LocalStorageService,
              private httpClient: HttpClient) {}

  isLogedIn(): boolean {
    return true;
  }

  isAuthorized(): boolean {
    return this.getToken() !== null;
  }

  login(data: LoginCredentials): Observable<Token> {
    const url: string = this.basePath + this.loginPath;
    return this.httpClient.post<Token>(url, data);
  }

  logout() {
    this.deleteToken();
  }

  getToken(): string {
    const res: string = this.localStorageService.getItem(this.tokenKey);
    return (res) ? JSON.parse(res).token : null;
  }

  setToken(token: string) {
    this.localStorageService.setItem(this.tokenKey, JSON.stringify({ token: token}));
  }

  deleteToken() {
    this.localStorageService.removeItem(this.tokenKey);
  }

  isAdministrator(): boolean {
    return true
  }
}
