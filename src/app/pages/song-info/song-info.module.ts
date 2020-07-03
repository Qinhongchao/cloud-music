import { ShareModule } from './../../share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongInfoRoutingModule } from './song-info-routing.module';
import { SongInfoComponent } from './song-info.component';


@NgModule({
  declarations: [SongInfoComponent],
  imports: [
    ShareModule,
    SongInfoRoutingModule
  ]
})
export class SongInfoModule { }
