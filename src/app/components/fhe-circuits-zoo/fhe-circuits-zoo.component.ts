import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-fhe-circuits-zoo',
  templateUrl: './fhe-circuits-zoo.component.html',
  styleUrls: ['./fhe-circuits-zoo.component.css']
})

export class FheCircuitsZooComponent implements OnInit{
  displayedColumns: string[] = ['name', 'email', 'created'];
  dataSource = [];
  spinning = false;
  
  constructor(
    private router: Router,
    private http: HttpClient) {}
  
  async ngOnInit() {
    this.spinning = true;
    try {
      const r = await firstValueFrom(this.http.get<any>(`circuits`));
      this.dataSource = r;
    } finally {
      this.spinning = false;
    }
  }

  filterResults(text: string) : void {

  }
}
