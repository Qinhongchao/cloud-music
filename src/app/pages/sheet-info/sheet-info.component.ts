import { MemberService } from 'src/app/services/member.service';
import { findIndex } from 'src/app/utils/array';
import { BatchActionsService } from './../../store/batch-actions.service';
import { getPlayer, getCurrentSong } from './../../store/selectors/player.selector';
import { AppStoreModule } from './../../store/index';
import { SongSheet, Song } from './../../data-types/common.types';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { SongService } from 'src/app/services/song.service';

import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit,OnDestroy {
 
 

  public sheetInfo:SongSheet;
  public description={
    short:'',
    long:''
  }

  controlDesc={
    isExpand:false,
    label:'展开',
    iconCls:'down'
  }

  private appStore$:Observable<AppStoreModule>
  private destroy$=new Subject<void>();
 public  currentSong: Song;
  currentIndex: number=-1;

  constructor(
    private route:ActivatedRoute,
    private store$:Store<AppStoreModule>,
    private songServe:SongService,
    private batchActionServe:BatchActionsService,
    private messageServe:NzMessageService,
    private memberServe:MemberService,
   
    ) {

    this.route.data.pipe(map(res=>res.sheetInfo)).subscribe(res=>{
     this.sheetInfo=res;
     if(res.description){
       this.changeDesc(res.description);
     }

     this.listenCurrent();
    })
   }
 

   listenCurrent() {
    this.store$.pipe(select(getPlayer),select(getCurrentSong),takeUntil(this.destroy$)).subscribe(song=>{
      this.currentSong=song;
      if(song){
        this.currentIndex=findIndex(this.sheetInfo.tracks,song);
      }else{
        this.currentIndex=-1;
      }
    })
  }

  ngOnInit(): void {
  }

  changeDesc(desc: string) {
    if(desc.length<99){
     
      this.description={
       
        short:this.replaceBr('<b>介绍:</b>'+desc),
        long:''
      }

    }else{
    
      this.description={
        
        short:this.replaceBr('<b>介绍:</b>'+desc.slice(0,99)+'...'),
        long:this.replaceBr('<b>介绍:</b>'+desc)
      }
    }
  }

  toggleDesc(){
    this.controlDesc.isExpand=!this.controlDesc.isExpand;

    if(this.controlDesc.isExpand){
      this.controlDesc.label="收起";
      this.controlDesc.iconCls='up';
    }else{
      this.controlDesc.label='展开';
      this.controlDesc.iconCls='down'
    }
  }
  
  private replaceBr(str:string):string{
    return str.replace(/\n/g,'<br/>');
  }

  onAddSong(song:Song,isPlay=false){
    if(!this.currentSong||this.currentSong.id!==song.id){
      this.songServe.getSongList(song).subscribe(
        list=>{
          if(list.length){
            this.batchActionServe.insertSong(list[0],isPlay);
          }else{
            this.messageServe.create('warning','无URL!');
          }
          
        }
      )
    }
  }

  ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
  }

  onAddSongs(songs:Song[],isPlay:boolean=false){
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

  onLikeSong(id:string){

 
  this.batchActionServe.likeSong(id);

  }

  onLikeSheet(id:string){
    this.memberServe.likeSheet(id).subscribe(()=>{
      this.batchActionServe.controlModal(false);
      this.alertMessage('success','收藏成功');
    },error=>{
      this.alertMessage('error',error.msg||'收藏失败');
    })
  }

  alertMessage(type:string,msg:string) {
    this.messageServe.create(type,msg);
  }
}
