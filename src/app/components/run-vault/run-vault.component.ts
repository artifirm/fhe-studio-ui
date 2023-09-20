import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

interface ParamDesc {
  name: string
  isEncrypted: boolean
}
@Component({
  selector: 'app-run-vault',
  templateUrl: './run-vault.component.html',
  styleUrls: ['./run-vault.component.css']
})
export class RunVaultComponent implements OnInit{
  paramsForm =new UntypedFormGroup({});
  id: any;
  paramsDesc: boolean[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private data: RunVaultComponent
    ) {
      this.id = this.data.id;
  }
  async ngOnInit() {
   
    await this.load_specs();
  }

  get fval() { return this.paramsForm.controls; }

  async load_specs() {
    const resp = await firstValueFrom(
      this.http.post<any>(`vault/client-specs/${this.id}`, {})) 
    const inputs = resp['inputs'];
    let  i = 0;
    
    console.log(resp)

    const paramsDesc: boolean[] = inputs
    .map((a: { [x: string]: any; }) => a['encryption']?? "-1")
    .map((a: { [x: string]: any; }) => a['secretKeyID'] ?? "-1")
    .map((a: string) => a !== "-1");

    const params: {[key: string]: any;} = {"password": new FormControl("xxx")};
    
    paramsDesc.forEach(a=> {
      params[`param${++i}`] = new FormControl("0")
    })

    console.log('params',params, paramsDesc)
    
    this.paramsForm = new FormGroup(params);
    this.paramsDesc = paramsDesc;
   
  }

  async encryptRunDecrypt(): Promise<string[]> {

    const password = this.fval['password'].value;
    const values = this.paramsDesc.map((a,i) => this.fval[`param${++i}`].value);
    const encrypted = await this.encrypt(values, password);
    const executed = await this.runCircuit(encrypted);
    const decrypted = await this.decrypt(executed, password);
    return decrypted;
  }
  
  async encrypt(values: string[], password: string): Promise<string[]> {
    const resp = await firstValueFrom(
      this.http.post<any>(`vault/encrypt/${this.id}`, {values})) 
    console.log('encrypt',resp)
    return resp;
  }

  async runCircuit(encryptedValues: string[]) {

    const resp = await firstValueFrom(
      this.http.post<any>(`fhe-eval/${this.id}`, {values: encryptedValues})) 
    
    console.log('runCircuit', resp)
    
    return resp;
  }

  async decrypt(encryptedValues: string[], password: string) {
    const respDescrypted = await firstValueFrom(
      this.http.post<any>(`vault/decrypt/${this.id}`, {values: encryptedValues[0]})) 

      console.log('respDescrypted:', respDescrypted)
      return respDescrypted;
  }
}
