import { WINDOW } from './../../../../services/services.module';
import { WyScrollComponent } from './../wy-scroll/wy-scroll.component';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList, Inject } from '@angular/core';
import { Song } from 'src/app/data-types/common.types';
import { findIndex } from 'src/app/utils/array';
import { timer } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { WyLyric, BaseLyricLine } from './wy-lyric';




@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;
  @Input() playing: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @Output() onDeleteSong=new EventEmitter<Song>();
  @Output() onClearSong=new EventEmitter<void>();
  @Output() onToInfo=new EventEmitter<[string,number]>();
  @Output() onLikeSong=new EventEmitter<string>();
  @Output() onShareSong=new EventEmitter<Song>();
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;


  public currentLyric: BaseLyricLine[];

  public scrollY: number = 0;
  private lyric: WyLyric;

 

  private lyricRefs:NodeList;

  public currentLineNum: number;
  private startLine: number=2;

  constructor(private songServe: SongService) { }


  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {

    if(changes['playing']){
      if(!changes['playing'].firstChange){
       this.lyric&& this.lyric.togglePlay(this.playing);
      }
    }

    if (changes['songList']) {

      if(this.currentSong){
        this.updateCurrentIndex();
      }

     
    }
    if (changes['currentSong']) {
      if (this.currentSong) {
        this.updateCurrentIndex();
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      }else{
        this.resetLyric();
      }
    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }

          if(this.lyricRefs){
            
             /*  const targetLine=this.lyricRefs[this.currentLineNum-this.startLine];
              if(targetLine){
                this.wyScroll.last.scrollToElement(targetLine,0,false,false);
              } */
              this.scrollToCurrentLyric(0);
           
          }
        })

      }
    }

  }
  updateLyric() {
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      this.startLine=res.tlyric?1:2
      this.handleLyric();
      this.wyScroll.last.scrollTo(0, 0);
      if (this.playing) {
          this.lyric.play();
      }
    });
  }


  handleLyric() {
  // this.resetLyric();

    this.lyric.handler.subscribe(({lineNum})=>{
      if(!this.lyricRefs){
        this.lyricRefs=this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }

      if(this.lyricRefs.length){
        this.currentLineNum=lineNum;
        if(lineNum>this.startLine){
          this.scrollToCurrentLyric(300)
         /*  const targetLine=this.lyricRefs[lineNum-startLine];
          if(targetLine){
            this.wyScroll.last.scrollToElement(targetLine,300,false,false);
          } */
        }else{
          this.wyScroll.last.scrollTo(0,0);
        }

       
      }
      
     
    })
  }
  resetLyric() {
    if(this.lyric){
      this.lyric.stop();
      this.lyric=null;
      this.currentLyric=[];
      this.currentLineNum=0;
      this.lyricRefs=null;

    }
  }
  scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetHeight = currentLi.offsetHeight;
      const offsetTop = currentLi.offsetTop;
      if (((offsetTop - Math.abs(this.scrollY)) > offsetHeight * 5) || (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }

  scrollToCurrentLyric(speed = 300) {
    const targetLine=this.lyricRefs[this.currentLineNum-this.startLine];
              if(targetLine){
                this.wyScroll.last.scrollToElement(targetLine,speed,false,false);
              }
  }


  seekLyric(time:number){
    if(this.lyric){
      this.lyric.seek(time);
    }
  }

  updateCurrentIndex(){
    this.currentIndex=findIndex(this.songList,this.currentSong);
  }

  toInfo(event:MouseEvent,path:[string,number]){
    event.stopPropagation();
    this.onToInfo.emit(path);
  }

  likeSong(event:MouseEvent,id:string){
    event.stopPropagation();
    this.onLikeSong.emit(id);
  }

  shareSong(event:MouseEvent,song:Song){
    event.stopPropagation();
    this.onShareSong.emit(song);
  }


}
