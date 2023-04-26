import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from 'src/app/add/add.component';
import { HomeComponent } from 'src/app/home/home.component';
import { LoginComponent } from 'src/app/login/login.component';
import { AdminComponent } from 'src/app/admin/admin.component';
import { AuthGuard } from './_helpers';
import {PaperworkComponent} from "./paperwork/paperwork.component";
import { UserComponent } from 'src/app/user/user.component';
import { CreateAdminComponent } from 'src/app/create-admin/create-admin.component';
import { AddCarComponent } from 'src/app/add-car/add-car.component';


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
    path:'paperwork/:id',
    component:PaperworkComponent,
  },
  {
    path:'createAdmin',
    component:CreateAdminComponent,
  },
  {
    path:'orderList',
    component:UserComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'admin',
    component:AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addCar',
    component:AddCarComponent,
  },
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
