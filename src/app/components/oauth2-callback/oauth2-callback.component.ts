import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/model/user';
import { AuthProvider, AuthenticationService } from 'src/services/authentication-service';


@Component({
  selector: 'app-oauth2-callback',
  templateUrl: './oauth2-callback.component.html',
  styleUrls: ['./oauth2-callback.component.css']
})
export class Oauth2CallbackComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
    ) { }

  async ngOnInit() {
    const params = await firstValueFrom(this.route.queryParams);
    const code = params['code'] ?? '';
    console.log(`auth code: ${code}`);
    
    let authProvider: AuthProvider;
    if (code === 'dev-code') {
      authProvider = this.authenticationService.authProvider('dev')!!;
    } else if (code.startsWith('fhe')) {
      authProvider = this.authenticationService.authProvider('fheStudio')!!;
    } else {
      authProvider = this.authenticationService.authProvider('google')!!;
    }
    
    console.log(`using ${authProvider.name} authProvider`)

    const tokenResponse = await firstValueFrom(this.http.post<any>(
      `${authProvider.oauth2TokenUrl}&code=${code}&client_id=${authProvider.oauth2ClientId}&client_secret=${authProvider.oauth2ClientPassword}`, {}));

    const access_token = tokenResponse['access_token'];
    
    const userInfo = await firstValueFrom(this.http.get<any>(
      authProvider.oauth2UserInfo,
      { headers: new HttpHeaders({ Authorization: `Bearer ${access_token}` }) }));

    console.log(`Logged User:`, userInfo)
    const user: User = { 
      email: userInfo['email'], 
      sub: userInfo['sub'], 
      picture: userInfo['picture'], 
      email_verified: userInfo['email_verified'],
      token: access_token }
    

    this.authenticationService.setToken(user)
    this.router.navigate([''])
  }
}
