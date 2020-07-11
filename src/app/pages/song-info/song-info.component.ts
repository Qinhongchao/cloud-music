import { SongService } from 'src/app/services/song.service';
import { map, takeUntil, findIndex } from 'rxjs/internal/operators';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Song, Singer } from 'src/app/data-types/common.types';
import { BaseLyricLine, WyLyric } from 'src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { SetShareInfo } from 'src/app/store/actions/member.action';


@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit ,OnDestroy{
  song:Song;
  lyric:BaseLyricLine[];
  controlLyric={
    isExpand:false,
    label:'展开',
    iconCls:'down'
  };

  private appStore$:Observable<AppStoreModule>
  private destroy$=new Subject<void>();
 public  currentSong: Song;
  currentIndex: number=-1;
  
  constructor(
    private route:ActivatedRoute,
    private songServe:SongService,
    private store$:Store<AppStoreModule>,
    private batchActionServe:BatchActionsService,
    private nzMessageServe:NzMessageService) { 

    this.route.data.pipe(map(res=>res.songInfo)).subscribe(([song,lyric])=>{
      this.song=song;
      this.lyric=new WyLyric(lyric).lines;
      console.log('lyrics',this.lyric);
    })
  }
  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
  }

  onToggleExpand(){
    this.controlLyric.isExpand=!this.controlLyric.isExpand;

    if(this.controlLyric.isExpand){
      this.controlLyric.label="收起";
      this.controlLyric.iconCls='up';
    }else{
      this.controlLyric.label='展开';
      this.controlLyric.iconCls='down'
    }
  }

  listenCurrent() {
    this.store$.pipe(select(getPlayer),select(getCurrentSong),takeUntil(this.destroy$)).subscribe(song=>{
      this.currentSong=song;
     
    })
  }

  onAddSong(song:Song,isPlay=false){
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song)
      .subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay);
        }else {
          this.nzMessageServe.create('warning', '无url!');
        }
      });
    }
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
