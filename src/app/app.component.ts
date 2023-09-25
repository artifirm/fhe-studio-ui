import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { User } from 'src/model/user';
import { AuthenticationService } from 'src/services/authentication-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  title = 'FHE Studio';
  isExpanded = true;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    ) { }

  logout() {
    this.authenticationService.logout();
  }

  login() {
    this.authenticationService.login();
  }

  public get currentUserEmail$(): Observable<string> {
    return this.authenticationService.currentUserObservable.pipe(
      map(a => a.email)
    );
  }

  primaryByUrl(url: string[]): string {
    return url.some(a=> this.router.url === a) ? 'primary' : '';
  }

}

