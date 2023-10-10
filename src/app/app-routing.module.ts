import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FheEditorComponent } from './components/fhe-editor/fhe-editor.component';
import { Oauth2CallbackComponent } from './components/oauth2-callback/oauth2-callback.component';
import { FheCircuitsZooComponent } from './components/fhe-circuits-zoo/fhe-circuits-zoo.component';
import { FheVaultComponent } from './components/fhe-vault/fhe-vault.component';

const routes: Routes = [
  { path: '', component: FheCircuitsZooComponent },
  { path: 'circuits-zoo', component: FheCircuitsZooComponent },
  { path: 'my-circuits', component: FheCircuitsZooComponent },
  { path: 'fhe-editor', component: FheEditorComponent },
  { path: 'oauth2', component: Oauth2CallbackComponent },
  { path: 'fhe-vault', component: FheVaultComponent },
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
