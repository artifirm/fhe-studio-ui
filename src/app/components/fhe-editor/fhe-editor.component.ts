import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
    value: `from concrete import fhe

    @fhe.compiler({"x": "encrypted"})
    def function(x):
        return x + 42
    
    inputset = range(10)
    circuit = function.compile(inputset)
    `,
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  name = ''
  description = ''

  spinning = false
  editNotes = false
  notesForm!: UntypedFormGroup;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient) {

   
  }


  ngOnInit(): void {
    this.name = this.newName()
    this.notesForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      description: [''],
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

  async save() {
    this.spinning = true;
    try {
      const r = await firstValueFrom(
        this.http.post<any>(`edit-circuit`, { src: this.codeModel.value }));
    } finally {
      this.spinning = false;
    }
  }
}
