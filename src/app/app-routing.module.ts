import { HomeModule } from './pages/home/home.module';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path:'home',
    loadChildren:()=> import('./pages/home/home.module').then(mod=>mod.HomeModule)
  },
  {path:'' ,redirectTo:'/home',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration:'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
