import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs';
import { Song } from 'src/app/data-types/common.types';
import { RecordType, MemberService } from 'src/app/services/member.service';
import { recordVal, User } from 'src/app/data-types/member.types';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { SongService } from 'src/app/services/song.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit ,OnDestroy{

  user:User;
  records:recordVal[];
  recordType=RecordType.weekData;
  currentSong: Song;
  currentIndex=-1;
  private destroy$=new Subject();

  constructor(private route: ActivatedRoute,
    private batchActionsServe :BatchActionsService,
    private memberServe:MemberService,
    private songServe:SongService,
    private nzMessageServe:NzMessageService,
    private store$:Store<AppStoreModule>,
    private cdr:ChangeDetectorRef
    ) {

    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord]) => {
      this.user=user;
      this.records=userRecord;
      this.listenCurrentSong();
     
    });
   }
   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
   }

  ngOnInit(): void {
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
      this.cdr.markForCheck();
    })
   }

   onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberServe.getUserRecord(this.user.profile.userId.toString(), type)
      .subscribe(records =>{
        this.records = records;
        this.cdr.markForCheck();
      } );
    }
  }

}
