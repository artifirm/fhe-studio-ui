import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {

  passwordChangeForm: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<PasswordChangeComponent>,
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient) {
    this.passwordChangeForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordOnceMore: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get fval() { return this.passwordChangeForm.controls; }
  get currentPassword() { return this.fval['currentPassword'].value; }
  get password() { return this.fval['password'].value; }
  get passwordOnceMore() { return this.fval['passwordOnceMore'].value; }

  async onConfirm() {

    if (!this.passwordChangeForm.valid) {
      return
    }
    try {
      if (this.password !== this.passwordOnceMore) throw new Error("password don't match!");
      await firstValueFrom(this.http.post<any>('oid_password_update', 
        { current_password: this.currentPassword, new_password: this.password }))
      this.dialogRef.close(false);
    } catch(e:any) {
      alert(e.message);
    }
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
