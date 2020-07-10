import { RecordType } from './../../../../services/member.service';
import { recordVal } from 'src/app/data-types/member.types';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Song } from 'src/app/data-types/common.types';


@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsComponent implements OnInit {

  @Input() records:recordVal[];
  @Input() recordType=RecordType.weekData;
  @Input() listenSongs=0;
  @Input() currentIndex=-1;
  @Output() onAddSong=new EventEmitter<[Song,boolean]>();

  @Output() onChangeType=new EventEmitter<RecordType>();

  constructor() { }

  ngOnInit(): void {
  }

}
