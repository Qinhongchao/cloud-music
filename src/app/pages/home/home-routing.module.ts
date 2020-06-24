import { HomeResolveService } from './components/home-resolve.service';

import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:'home',component:HomeComponent,data:{title:'发现'},resolve:{homeDatas:HomeResolveService}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
