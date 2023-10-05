import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-fhe-circuits-zoo',
  templateUrl: './fhe-circuits-zoo.component.html',
  styleUrls: ['./fhe-circuits-zoo.component.css']
})

export class FheCircuitsZooComponent implements OnInit{
  displayedColumns: string[] = ['name', 'polynomial_size', 'created'];
  dataSource = [];
  spinning = false;
  searchForm: UntypedFormGroup;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder) {
      this.searchForm = this.formBuilder.group({
        searchName: [''],
      });

      this.route.queryParams.subscribe(async params => {
        const term = params['name'] ?? '';
          await this.load(term)
      })
    }
  
  async ngOnInit() {
   
  }

  async load(name: string) {
    this.spinning = true;
    try {
      const r = await firstValueFrom(this.http.get<any>(`circuits?name=${name}`));
      this.dataSource = r;
    } finally {
      this.spinning = false;
    }
  }

  filterResults(name: string) : void {
    this.router.navigate([`/circuits-zoo`], { queryParams: {name}})
  }
}
