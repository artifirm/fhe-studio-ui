import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication-service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  createUserForm: UntypedFormGroup;
  errorString = '';
  loading = false;

  constructor(public dialogRef: MatDialogRef<CreateUserComponent>,
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private http: HttpClient) {
    this.createUserForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordOnceMore: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get fval() { return this.createUserForm.controls; }
  get username() { return this.fval['username'].value; }
  get password() { return this.fval['password'].value; }
  get passwordOnceMore() { return this.fval['passwordOnceMore'].value; }

  async onConfirm() {
    if (!this.createUserForm.valid) {
      return;
    }

    this.errorString = '';
    this.loading =true;

    try {
      if (this.passwordOnceMore !== this.password) {
        throw Error('Passwords don\'t match');
      }
 
      const r = await firstValueFrom(this.http.post<any>('fhe-create-user', 
        { username: this.username, password: this.password }))
      
      const p  = this.authenticationService.authProvider('fheStudio')!!;
      const url = `${p.oauth2LoginUrl}${r.code}&client_id=${p.oauth2ClientId}`;
      window.location.href = url;
    } catch(e: any) {
      this.errorString = e.message;
    } finally {
      this.loading =false;
    }
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
