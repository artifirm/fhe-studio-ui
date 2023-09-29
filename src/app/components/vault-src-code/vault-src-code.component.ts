import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { firstValueFrom } from 'rxjs';
import { RunVaultComponent } from '../run-vault/run-vault.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vault-src-code',
  templateUrl: './vault-src-code.component.html',
  styleUrls: ['./vault-src-code.component.css']
})
export class VaultSrcCodeComponent implements OnInit {

  codeModel: CodeModel = {
    language: 'python',
    uri: 'main.py',
    value: '',
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  theme = 'vs-dark';
  persitedId = ''

  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private data: RunVaultComponent) {
      this.persitedId = data.id;
    }

  async ngOnInit() {
    const c = await firstValueFrom(this.http.post<any>(`circuit/${this.persitedId}`, {}))
    this.codeModel = {...this.codeModel, value: c['src'] };
  }
}
