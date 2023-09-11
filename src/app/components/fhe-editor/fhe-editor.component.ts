import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeModel } from '@ngstack/code-editor';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication-service';

@Component({
  selector: 'app-fhe-editor',
  templateUrl: './fhe-editor.component.html',
  styleUrls: ['./fhe-editor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FheEditorComponent implements OnInit {

  theme = 'vs-dark';

  codeModel: CodeModel = {
    language: 'python',
    uri: 'main.py',
    value: `
@fhe.compiler({"x": "encrypted"})
def circuit(x):
    return x + 42

inputset = range(10)`,
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  name = ''
  persitedId = ''

  spinning = false
  editNotes = false
  notesForm!: UntypedFormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient) {

   
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.persitedId = params['id'] ?? '';
        await this.reload()
    })
  }

  async reload() {
    let description = '';

    if (this.persitedId !== ''){
      this.spinning = true;
      const c = await firstValueFrom(this.http.post<any>(`circuit/${this.persitedId}`, {}))

      this.name = c['name'];
      description = c['description'];
      this.codeModel = {
        language: 'python',
        uri: 'main.py',
        value: c['src'] };

      this.spinning = false;
    } else {
      this.name = this.newName()
    }

    this.notesForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      description,
    });
  }

  newName(): string {
    const ts = new Date().getTime() % 100000;
    let n = this.authenticationService.currentUserValue.email || 'my'
    const emailAccountPos = n.indexOf('@')
    if (emailAccountPos > -1) {
      n = n.slice(0, emailAccountPos)
    }
    return `${n}-fhe-circuit-${ts}`;
  }

  get fval() { return this.notesForm.controls; }

  async save() {
    if (this.notesForm.invalid) {
      return;
    }

    this.spinning = true;
    try {
      const r = await firstValueFrom(
        this.http.post<any>(`edit-circuit/${this.persitedId}`, 
          { 
            src : this.codeModel.value,
            name : this.fval['name'].value,
            description : this.fval['description'].value
          }));
    } finally {
      this.spinning = false;
    }
  }
}
