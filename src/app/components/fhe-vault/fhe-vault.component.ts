import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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
    private router: Router,
    private http: HttpClient) {}
  
  async ngOnInit() {
    this.spinning = true;
    try {
      const r = await firstValueFrom(this.http.get<any>(`vault`));
      this.dataSource = r;
    } finally {
      this.spinning = false;
    }
  }
}
