import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Course} from "../../../models/content/course";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../services/auth.service";
import {Injectable, Injector} from "@angular/core";
import {globalProperties} from "../../../../environments/properties";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly skipUrls = [
    globalProperties.basePath + globalProperties.loginPath
  ];

  // NOTE: this injection will generate an Cyclic dependency error because
  // AuthService also injects HttpClient. AuthService will be manually injected on intercept()
  // constructor(private authService: AuthService){}
  constructor(private injector: Injector){}

  intercept(request: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>>{


    // validates if the url of the request should be skipped
    if (this.skipUrls.indexOf(request.url) >= 0) {
      return next.handle(request);
    }

    // manual injection of the AuthService to avoid cyclic dependency error
    let authService = this.injector.get(AuthService);

    const newRequest = request.clone({
      headers: request.headers.set("Token", authService.getToken())
    });
    return next.handle(newRequest);

  }
}
