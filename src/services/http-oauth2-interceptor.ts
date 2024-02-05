import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class HttpOAuth2Interceptor implements HttpInterceptor {

    ByPassFullUrls = [
        `${environment.apiUrl}mlir`,
        `${environment.apiUrl}play-circuit`,
        `${environment.apiUrl}/circuits`,
        `${environment.apiUrl}circuit/`,
        `${environment.apiUrl}fhe-create-user`,
        `${environment.apiUrl}oid-fhe-login`,
        ...Object.entries(environment.authProviders).map(a => a[1].oauth2TokenUrl),
        ...Object.entries(environment.authProviders).map(a => a[1].oauth2UserInfo),
     ];

     ByPassApiUrls = [
        `mlir`,
        `play-circuit`,
        `circuits`,
        `circuit/`,
        `fhe-create-user`,
        'oid-fhe-login'
     ];

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, params, headers, body } = request;
        console.log('http request, url: ', url);

        if (this.ByPassFullUrls.some(a => url.lastIndexOf(a) > -1  )) {
            return next.handle(request)
        }

        const user = this.authenticationService.currentUserValue ?? {}
        const token = user?.token ?? '';
        
        if (token.length === 0) {
            // public endpoints
            if (this.ByPassApiUrls.some(a => url.startsWith(a) )) {
                return next.handle(request.clone({
                    url: environment.apiUrl + request.url,
                    headers: new HttpHeaders({ 
                        'timezoneOffset': new Date().getTimezoneOffset()
                    }),
                }));
            }  else {
                this.authenticationService.login()
                throw Error('authentication token is missing')
                //return of(new HttpResponse({ body: [] }))
            }
        }

        return of(null)
            .pipe(mergeMap(handleRoute), catchError(e => {
                if (e.status === 401) {
                    this.authenticationService.logout();
                    this.authenticationService.login();
                } else if (e.status !== 200) {
                    const error =  new Error(e.message + ' ' + e.error)
                    console.log(e)
                    alert(e.error);
                    throw error;
                }
                return of(e);
            }))
            .pipe(materialize())
            .pipe(dematerialize());

        function handleRoute() {
            console.log(`going to  ${url}`);

            return next.handle(request.clone({
                url: environment.apiUrl + request.url,
                headers: new HttpHeaders({ 
                    Authorization: `Bearer ${token}`,
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
