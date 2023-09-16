import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-run-vault',
  templateUrl: './run-vault.component.html',
  styleUrls: ['./run-vault.component.css']
})
export class RunVaultComponent implements OnInit{
  paramsForm!: UntypedFormGroup;
  id: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private data: RunVaultComponent
    ) {
      this.id = this.data.id;
  }
  ngOnInit(): void {
    this.paramsForm = this.formBuilder.group({
      param1: ['1'],
      param2: ['2'],
    });
  }

  get fval() { return this.paramsForm.controls; }

  async encrypt(n: string) {
    const value = this.fval[n].value;
    const resp = await firstValueFrom(
      this.http.post<any>(`vault/encrypt/${this.id}`, {value})) 
  console.log(resp)
  this.fval[n].setValue(resp[0])
  }

  async runCircuit() {
    const value = this.fval['param1'].value;
    const resp = await firstValueFrom(
      this.http.post<any>(`fhe-eval/${this.id}`, {value})) 
    
    console.log(resp)

    const respDescrypted = await firstValueFrom(
      this.http.post<any>(`vault/decrypt/${this.id}`, {value: resp[0]})) 

      console.log('respDescrypted:', respDescrypted)

  }
}
