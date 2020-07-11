import { AppStoreModule } from './../../../../store/index';
import { BatchActionsService } from './../../../../store/batch-actions.service';
import { RecordType } from './../../../../services/member.service';
import { recordVal } from 'src/app/data-types/member.types';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Song, Singer } from 'src/app/data-types/common.types';
import { Store } from '@ngrx/store';
import { SetShareInfo } from 'src/app/store/actions/member.action';


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

  constructor(private batchActionServe:BatchActionsService,private store$:Store<AppStoreModule>) { }

  ngOnInit(): void {

  }

    
  onLikeSong(id: string) {


    this.batchActionServe.likeSong(id);

  }

  onShareSong(resource: Song , type = 'song') {
    let txt = '';
      txt = this.makeTxt('歌曲', resource.name, (<Song>resource).ar);
    this.store$.dispatch(SetShareInfo({ shareInfo: { id: resource.id.toString(), type, txt } }));
  }
  makeTxt(type: string, name: string, makeBy: string | Singer[]): string {

    let makeByStr = '';

    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map(item => item.name).join('/');
    } else {
      makeByStr = makeBy;
    }

    return `${type}:${name}--${makeByStr}`;

  }

}
