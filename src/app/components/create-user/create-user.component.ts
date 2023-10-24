import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  createUserForm: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<CreateUserComponent>,
    private formBuilder: UntypedFormBuilder) {
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

  onConfirm(): void {

    if (this.createUserForm.valid) {
      this.dialogRef.close(false);
    }
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
