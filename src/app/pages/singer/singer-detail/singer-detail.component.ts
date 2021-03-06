import { MemberService } from 'src/app/services/member.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SingerDetail, Song, Singer } from 'src/app/data-types/common.types';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit,OnDestroy {

  singerDetail: SingerDetail;
  currentIndex:number;
  currentSong:Song;
  hasLiked=false;
  private destroy$=new Subject<void>();
  simiSingers: Singer[];
  constructor(private route:ActivatedRoute,
    private store$:Store<AppStoreModule>,
    private songServe:SongService,
    private batchActionServe:BatchActionsService,
    private nzMessageServe:NzMessageService,
    private memberServe:MemberService
    ) { 
    this.route.data.pipe(map(res=>res.singerDetail)).subscribe(([detail,simiSingers])=>{
     this.singerDetail=detail;
    
    this.simiSingers=simiSingers;
     this.listenCurrent();
    })
  }

  ngOnInit(): void {
  }

  onAddSongs(songs:Song[],isPlay=false){
    this.songServe.getSongList(songs).subscribe(list=>{
      if(list.length){

        if(isPlay){
          this.batchActionServe.selectPlayList({list,index:0});
        }else{
          this.batchActionServe.insertSongs(list);
        }
       
      }else{
        alert('无URL');
      }
    })
  }

  onAddSong(song:Song,isPlay=false){
    if(!this.currentSong||this.currentSong.id!==song.id){
      this.songServe.getSongList(song).subscribe(
        list=>{
          if(list.length){
            this.batchActionServe.insertSong(list[0],isPlay);
          }else{
            this.nzMessageServe.create('warning','无URL!');
          }
          
        }
      )
    }
  }

  listenCurrent() {
    this.store$.pipe(select(getPlayer),select(getCurrentSong),takeUntil(this.destroy$)).subscribe(song=>{
      this.currentSong=song;
      if(song){
        this.currentIndex=findIndex(this.singerDetail.hotSongs,song);
      }else{
        this.currentIndex=-1;
      }
      console.log('currentIndex:',this.currentIndex);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
   }

   onLikeSongs(songs:Song[]){
     const ids=songs.map(item=>item.id).join(',');
      this.onLikeSong(ids);
   }

   onLikeSong(id:string){
     this.batchActionServe.likeSong(id);
   }

   onLikeSinger(id:string){
    let typeInfo={
      type:1,
      msg:'收藏'
    }
    if(this.hasLiked){
      typeInfo={
        type:2,
        msg:'取消收藏'
      }
    }
    this.memberServe.likeSinger(id,typeInfo.type).subscribe(()=>{
      this.hasLiked=!this.hasLiked;
      this.nzMessageServe.create('error',typeInfo.msg+'成功')
    },error=>{
      this.nzMessageServe.create('error',error.msg||typeInfo.msg+'失败')
    })
    
   }

}
