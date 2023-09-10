import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/model/user';
import { AuthenticationService } from 'src/services/authentication-service';

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
    const code = params['code']
    console.log(`auth code: ${code}`);

    const tokenResponse = await firstValueFrom(this.http.post<any>(
      `${environment.oauth2TokenUrl}&code=${code}&client_id=${environment.oauth2ClientId}&client_secret=${environment.oauth2ClientPassword}`, {}));

    const access_token = tokenResponse['access_token'];
    
    const userInfo = await firstValueFrom(this.http.get<any>(
      environment.oauth2UserInfo,
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
