import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class HttpOAuth2Interceptor implements HttpInterceptor {

    ByPassUrls = [
        environment.oauth2UserInfo,
        environment.oauth2TokenUrl ];

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, params, headers, body } = request;
        console.log('http request, url: ', url);

        if (this.ByPassUrls.some(a => url.lastIndexOf(a) > -1  )) {
            return next.handle(request)
        }

        const user = this.authenticationService.currentUserValue ?? {}
        const token = user?.token ?? '';
        
        if (token.length === 0) {
            this.authenticationService.login()
            return of(new HttpResponse({ body: {} }))
        }

        return of(null)
            .pipe(mergeMap(handleRoute), catchError(e => {
                if (e.status === 401) {
                    this.authenticationService.logout();
                    this.authenticationService.login();
                } else if (e.status !== 200) {
                    const error =  new Error(e.message + ' ' + e.error)
                    console.log(e)
                    alert(e.message);
                    throw error;
                }
                return of(e);
            }))
            .pipe(materialize())
            .pipe(dematerialize());

        function handleRoute() {
            console.log(`going to  ${url}`);

            const baseUrl = environment.apiUrl;

            return next.handle(request.clone({
                url: baseUrl + request.url,
                headers: new HttpHeaders({ 
                    Authorization: `Bearer ${token}`,
                    'email': user.email,
                    'sub': user.sub,
                    'timezoneOffset': new Date().getTimezoneOffset()
                }),
            }));
        }
    }
}

export const httpOAuth2Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpOAuth2Interceptor,
    multi: true,
    deps: [AuthenticationService, Router]
};
