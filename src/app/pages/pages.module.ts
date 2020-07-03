import { SongInfoModule } from './song-info/song-info.module';
import { SheetInfoModule } from './sheet-info/sheet-info.module';
import { SheetListModule } from './sheet-list/sheet-list.module';
import { HomeModule } from './home/home.module';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
  ],
  exports:[
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule
  ]
})
export class PagesModule { }
