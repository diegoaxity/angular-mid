import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';

// http://localhost:4200/login
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  // http://localhost:4200/login/recover
  // {
  //   path: 'recover',
  //   component: RecoverComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
