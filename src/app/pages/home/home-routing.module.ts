/*
 * @Author: your name
 * @Date: 2020-06-23 14:44:11
 * @LastEditTime: 2020-06-23 14:49:22
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \cloud-music\src\app\pages\home\home-routing.module.ts
 */ 
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:'home',component:HomeComponent,data:{title:'发现'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
