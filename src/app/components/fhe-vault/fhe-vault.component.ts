import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RunVaultComponent } from '../run-vault/run-vault.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { VaultSrcCodeComponent } from '../vault-src-code/vault-src-code.component';

@Component({
  selector: 'app-fhe-vault',
  templateUrl: './fhe-vault.component.html',
  styleUrls: ['./fhe-vault.component.css']
})
export class FheVaultComponent {
  displayedColumns: string[] = ['name', 'action', 'created'];
  dataSource = [];
  spinning = false;
  
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient) {}
  
  async ngOnInit() {
    this.spinning = true;
    try {
      const r = await firstValueFrom(this.http.post<any>(`vault`, {}));
      this.dataSource = r;
    } finally {
      this.spinning = false;
    }
  }

  async runCircuit(id: string) {
    await firstValueFrom(this.dialog.open(RunVaultComponent, {
      minWidth: '20vw',
      minHeight: '20vh',
      data: {
        id
      }
    }).afterClosed());
  }

  async deleteVaultItem(id: string) {
    const res = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Confirmation',
        message: 'Do you want to delete this key ?'
      }
    }).afterClosed());

    if (res) {
      const r = await firstValueFrom(
        this.http.delete<any>(`/delete-vault-item/${id}`));
        
        await this.ngOnInit();
    }
  }

  async showSrc(id: string) {
    await firstValueFrom(this.dialog.open(VaultSrcCodeComponent, {
      minWidth: '65vw',
      minHeight: '40vh',
      data: {
        id
      }
    }).afterClosed());
  }
}
