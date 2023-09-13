import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-run-vault',
  templateUrl: './run-vault.component.html',
  styleUrls: ['./run-vault.component.css']
})
export class RunVaultComponent implements OnInit{
  paramsForm!: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient) {

   
  }
  ngOnInit(): void {
    this.paramsForm = this.formBuilder.group({
      param1: ['1'],
      param2: ['2'],
    });
  }

}
