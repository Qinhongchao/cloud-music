import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/data-types/common.types';
import { NzMessageService } from 'ng-zorro-antd';
import { SongService } from 'src/app/services/song.service';
import { MemberService } from 'src/app/services/member.service';
import { RecordType } from './../../../services/member.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { recordVal, User, UserSheet } from 'src/app/data-types/member.types';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { findIndex } from 'src/app/utils/array';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CenterComponent implements OnInit ,OnDestroy{


  user:User;
  records:recordVal[];
  userSheet:UserSheet;
  recordType=RecordType.weekData;
  currentSong: Song;
  currentIndex=-1;
  private destroy$=new Subject();


  constructor(private route: ActivatedRoute,
      private sheetServe:SheetService,
      private batchActionsServe :BatchActionsService,
      private memberServe:MemberService,
      private songServe:SongService,
      private nzMessageServe:NzMessageService,
      private store$:Store<AppStoreModule>,
      private cdr:ChangeDetectorRef
   

    ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord, userSheet]) => {
      this.user=user;
      this.records=userRecord.slice(0,10);
      this.userSheet=userSheet;
      this.listenCurrentSong();
    });
  }
  ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
  }

  listenCurrentSong() {
   this.store$.pipe(select(getPlayer),select(getCurrentSong),takeUntil(this.destroy$)).subscribe(song=>{
     this.currentSong=song;
     if(song){
       const songs=this.records.map(item=>item.song);
       this.currentIndex=findIndex(songs,song);
     }else{
       this.currentIndex=-1;
     }
   })
  }

  ngOnInit(): void {
  }

  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.batchActionsServe.selectPlayList({ list, index: 0});
    });
  }

  onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberServe.getUserRecord(this.user.profile.userId.toString(), type)
      .subscribe(records => {
        this.records = records.slice(0, 10);
        this.cdr.markForCheck();
      });
    }
  }

  onAddSong([song,isPlay]){
    if(!this.currentSong||this.currentSong.id!==song.id){
      this.songServe.getSongList(song).subscribe(
        list=>{
          if(list.length){
            this.batchActionsServe.insertSong(list[0],isPlay);
          }else{
            this.nzMessageServe.create('warning','无URL!');
          }
          
        }
      )
    }
  }


}
