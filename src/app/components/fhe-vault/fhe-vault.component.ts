import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RunVaultComponent } from '../run-vault/run-vault.component';

@Component({
  selector: 'app-fhe-vault',
  templateUrl: './fhe-vault.component.html',
  styleUrls: ['./fhe-vault.component.css']
})
export class FheVaultComponent {
  displayedColumns: string[] = ['id', 'name'];
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
      maxWidth: '400px',
      data: {
        id
      }
    }).afterClosed());
  }
}
