import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeModel } from '@ngstack/code-editor';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication-service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-fhe-editor',
  templateUrl: './fhe-editor.component.html',
  styleUrls: ['./fhe-editor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FheEditorComponent implements OnInit {

  logPanelOpenState = false;
  output = '';
  theme = 'vs-dark';

  defaultSrc = `from concrete import fhe
@fhe.compiler({"x": "encrypted", "y": "encrypted"})
def add(x, y):
    return x + y

inputset = [(2, 3), (0, 0), (1, 6), (7, 7), (7, 1)]
circuit = add.compile(inputset)

x = 4
y = 4

clear_evaluation = add(x, y)
homomorphic_evaluation = circuit.encrypt_run_decrypt(x, y)

print(x, "+", y, "=", clear_evaluation, "=", homomorphic_evaluation)`
  codeModel: CodeModel = {
    language: 'python',
    uri: 'main.py',
    value: this.defaultSrc,
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  persitedId = ''
  fheError = ''

  spinning = false
  editNotes = false
  notesForm!: UntypedFormGroup;
  locked = false

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient) {

      this.route.queryParams.subscribe(async params => {
        this.persitedId = params['id'] ?? '';
          await this.reload()
      })
  }


  ngOnInit(): void {
   
  }

  async reload() {
    let description = '';
    let name = '';
    this.locked = false;
    let isPrivate = false;
    let isPublished = false;

    if (this.persitedId !== ''){
      this.spinning = true;
      const c = await firstValueFrom(this.http.post<any>(`circuit/${this.persitedId}`, {}))

      name = c['name'];
      description = c['description'];
      this.codeModel = {...this.codeModel, value: c['src'] };
      this.locked = c['locked'];
      isPrivate = c['is_private'] ?? false;
      isPublished = c['is_published'] ?? false;
      this.output= c['output'] ?? '';

      this.spinning = false;
    } else {
      name = this.newName()
      this.codeModel = {...this.codeModel, value: this.defaultSrc };
    }

    this.notesForm = this.formBuilder.group({
      name: [name, Validators.required],
      isPrivate: [isPrivate],
      isPublished: [isPublished],
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
  get name()  { return this.fval['name'].value; }

  async save() {
    this.fheError = '';
    if (this.notesForm.invalid) {
      return;
    }

    this.spinning = true;
    try {
      const r = await firstValueFrom(
        this.http.put<any>(`edit-circuit/${this.persitedId}`, 
          { 
            src : this.codeModel.value,
            name : this.fval['name'].value,
            description : this.fval['description'].value,
            'is_private': this.fval['isPrivate'].value,
            'is_published': this.fval['isPublished'].value
          }));
          console.log('edit-circuit', r)
          this.fheError = r.exception ?? '';
          this.output= r.output ?? '';
        if (!this.persitedId) {
          this.router.navigate([`/fhe-editor`], { queryParams: {id: r.id}})
        }
    } finally {
      this.spinning = false;
    }
  }

  async addToVault() {
    const res = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Vault',
        message: 'Create a new secret and evaluation key for this cirucit ?'
      }
    }).afterClosed());

    if (res) {
      await firstValueFrom(
        this.http.put<any>(`/add-vault/${this.persitedId}`, {}));
      this.router.navigate(['fhe-vault']);
    }
  }

  async deleteCircuit() {
    const res = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Delete Confirmation',
        message: 'Do you want to completely delete this circuit ?'
      }
    }).afterClosed());

    if (res) {
      const r = await firstValueFrom(
        this.http.delete<any>(`/delete-circuit/${this.persitedId}`));
      this.router.navigate(['']);
    }
  }

  isAuthenticated(): boolean {
    return this.authenticationService.isAuthenticated()
  }

  get publishedButtonColor(): string {
    return this.fval['isPublished'].value ? 'primary': 'basic';
  }

  async publish() {
    const res = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Publish Circuit',
        message: 'Do you want to publish this circuit to Circuit Zoo?'
      }
    }).afterClosed());

    if (res) {
      this.fval['isPublished'].setValue(true);
      await this.save();
    }
  }

  async showMlir() {
  
    const r = await firstValueFrom(this.http.get<any>(`mlir/${this.persitedId}`));
    const res = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'MLIR: Compiled Circuit',
        message: r['mlir']
      }
    }).afterClosed())

  }

  min(a: number,b: number): number {
    return Math.min(a,b);
  }

  async play() {
    this.spinning = true;
    try {
      const r = await firstValueFrom(
        this.http.post<any>('play-circuit', 
          { 
            src : this.codeModel.value,
          }));
          this.fheError = r.exception ?? '';
          this.output= r.output ?? '';
    } finally {
      this.spinning = false;
    }
  }
}
