import { SheetListComponent } from './sheet-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path:'sheet',component:SheetListComponent,data:{title:'歌单列表'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetListRoutingModule { }
