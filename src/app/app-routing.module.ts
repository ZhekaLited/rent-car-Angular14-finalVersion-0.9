import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from 'src/app/add/add.component';
import { HomeComponent } from 'src/app/home/home.component';
import { LoginComponent } from 'src/app/login/login.component';
import { AdminComponent } from 'src/app/admin/admin.component';
import { AuthGuard } from './_helpers';


const routes: Routes = [

  {
    path: 'register/:id',
    component: AddComponent,
  },
  {
    path:'',
    component:HomeComponent,
  },
  {
    path:'login',
    component:LoginComponent,
  },
  {
    path:'admin',
    component:AdminComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
