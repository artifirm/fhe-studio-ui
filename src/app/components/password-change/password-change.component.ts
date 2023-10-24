import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {

  passwordChangeForm: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<PasswordChangeComponent>,
    private formBuilder: UntypedFormBuilder) {
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

  onConfirm(): void {

    if (this.passwordChangeForm.valid) {
      this.dialogRef.close(false);
    }
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
