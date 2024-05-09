import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

interface ParamDesc {
  name: string
  isEncrypted: boolean,
  dimensions: number[] ,
  i: number,
  j: number,
}

interface ClientSpecsInput {
  encryption: 
    { secretKeyID: number }
  shape:
  { dimensions: number[] }
}

@Component({
  selector: 'app-run-vault',
  templateUrl: './run-vault.component.html',
  styleUrls: ['./run-vault.component.css']
})
export class RunVaultComponent implements OnInit{
  paramsForm =new UntypedFormGroup({});
  id: any;
  paramsDesc: ParamDesc[] = [];
  stage = -1
  result = ''

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
    const resp_b64 = await firstValueFrom(
      this.http.post<any>(`vault/client-specs/${this.id}`, {}))
    
    console.log('client-specs resp_b64:', resp_b64)
    const cs = JSON.parse(atob(resp_b64[0]));

    const inputs = cs['circuits'][0]['inputs'];
    console.log('client-specs:', inputs)

    const paramsDesc: ParamDesc[] = inputs
        .map((a: ClientSpecsInput, i: number) => {
          const encryption = a.encryption?.secretKeyID ?? -1;
          const dimensions = a.shape?.dimensions ?? [];
          const length: number = dimensions.reduce((a,b) => a * b, 1);
          if (length > 1) {
            return Array.from({ length }, (_, j) => 
              <ParamDesc>{ name: `Param ${i}_${j}`, isEncrypted: encryption !== -1, dimensions, i, j } )
          }
          return { name: `Param ${i}`, isEncrypted: encryption !== -1, dimensions, i, j: 0 }
        }).flat()

    console.log('paramsDesc', paramsDesc)

    const params: {[key: string]: any;} = {"password": new FormControl("xxx")};
    
    paramsDesc.forEach(a=> {
      params[a.name] = new FormControl("0")
    })
   
    this.paramsForm = new FormGroup(params);
    this.paramsDesc = paramsDesc;
   
  }

  async encryptRunDecrypt(): Promise<string[]> {
    try {
      const last: number[] = this.paramsDesc.map(a => a.i).slice(-1);
      const length = last.length > 0 ? last[0] + 1 : 0;

      const values = Array.from({length }, (_, i) => {
        const p = this.paramsDesc.find(a=> a.i === i) !!; 
        if (p.dimensions.length > 0) {
          return  this.paramsDesc
            .filter(b=> b.i === i)
            .map(b => +this.fval[b.name].value)
        }
        return +this.fval[p.name].value;
      })

      console.log('collected values:', JSON.stringify(values))

      this.stage = -1;
      this.result = ''

      const password = 'not-set';
      const clientSpecs = await firstValueFrom(
        this.http.post<any>(`vault/client-specs/${this.id}`, {})) 
      this.stage = 0;
      const encrypted = await this.encrypt(values, clientSpecs[0], password);
      this.stage = 1;
      const executed = await this.runCircuit(encrypted);
      this.stage = 2;
      const decrypted = await this.decrypt(executed, clientSpecs[0], password);
      this.result = decrypted;
      return decrypted;
    } finally {
      this.stage = -1;
    }
  }
  
  async encrypt(values: any, client_specs: any, password: string): Promise<string[]> {
    const resp = await firstValueFrom(
      this.http.post<any>(`vault/encrypt/${this.id}`, {values, client_specs})) 
    console.log('encrypt',resp)
    return resp;
  }

  async runCircuit(encryptedValues: string[]) {

    const resp = await firstValueFrom(
      this.http.post<any>(`fhe-eval/${this.id}`, {values: encryptedValues})) 
    
    console.log('runCircuit', resp)
    
    return resp;
  }

  async decrypt(encryptedValues: string[],  client_specs: any, password: string) {
    const respDescrypted = await firstValueFrom(
      this.http.post<any>(`vault/decrypt/${this.id}`, {values: encryptedValues[0], client_specs })) 

      console.log('respDescrypted:', respDescrypted)
      return respDescrypted;
  }
}
