import { SingerModule } from './singer/singer.module';
import { SongInfoModule } from './song-info/song-info.module';
import { SheetInfoModule } from './sheet-info/sheet-info.module';
import { SheetListModule } from './sheet-list/sheet-list.module';
import { HomeModule } from './home/home.module';

import { NgModule } from '@angular/core';
import { MemberModule } from './member/member.module';

@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
    SingerModule,
    MemberModule,
  ],
  exports:[
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
    SingerModule,
    MemberModule
  ]
})
export class PagesModule { }
