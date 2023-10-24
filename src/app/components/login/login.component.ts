import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AuthProvider, AuthenticationService } from 'src/services/authentication-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: UntypedFormGroup;
  devProvider: AuthProvider | undefined;
  fheStudioProvider: AuthProvider | undefined;
  googleProvider: AuthProvider | undefined;

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService){
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.devProvider = authenticationService.authProvider('dev')
    this.googleProvider = authenticationService.authProvider('google')
    this.fheStudioProvider = authenticationService.authProvider('fheStudio')
  }

  get fval() { return this.loginForm.controls; }
  get username()  { return this.fval['username'].value; }
  get password()  { return this.fval['password'].value; }

  onConfirmWithGoogle(): void {
    const p = this.googleProvider!!;
    const url = `${p.oauth2LoginUrl}&client_id=${p.oauth2ClientId}`;
    window.location.href = url;
    //this.dialogRef.close(true);
  }

  onConfirmWithDev(): void {
    const p = this.devProvider!!;
    const url = `${p.oauth2LoginUrl}&client_id=${p.oauth2ClientId}`;
    window.location.href = url;
    //this.dialogRef.close(true);
  }

  onConfirm(): void {
    
    if (this.loginForm.valid) {
      this.dialogRef.close(false);
    }
  }
  
  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  createNewUser() : void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }
}
