import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model/user';
import { LoginComponent } from 'src/app/components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const CurrentUserKey = 'fhe-studio-user'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private dialog: MatDialog) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem(CurrentUserKey) ?? '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentUserObservable(): Observable<User> {
        return this.currentUser;
    }

    isAuthenticated(): boolean {
        return (this.currentUserValue?.token ?? '').length > 0;
    }

    setToken(user: User) {
        localStorage.setItem(CurrentUserKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    login(): void {
        const dialogRef = this.dialog.open(LoginComponent, {
            data: {},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) return; // cancel
            const url = `${environment.oauth2LoginUrl}&client_id=${environment.oauth2ClientId}`;
            // console.log(`${url}`);
            window.location.href = url;
        });
    }

    logout() {
        // remove user data from local storage for log out
        localStorage.removeItem(CurrentUserKey);
        this.currentUserSubject.next(Object({}));
    }

}
