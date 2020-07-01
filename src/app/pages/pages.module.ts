import { SheetListModule } from './sheet-list/sheet-list.module';
import { HomeModule } from './home/home.module';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    SheetListModule
  ],
  exports:[
    HomeModule,
    SheetListModule
  ]
})
export class PagesModule { }
