import { ShareModule } from './../../share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { CenterComponent } from './center/center.component';
import { RecordsComponent } from './components/records/records.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';


@NgModule({
  declarations: [CenterComponent, RecordsComponent, RecordDetailComponent],
  imports: [
    MemberRoutingModule,
    ShareModule
  ]
})
export class MemberModule { }
