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
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  public currentLyric: BaseLyricLine[];

  public scrollY: number = 0;
  private lyric: WyLyric;
  public currentLineNum: number;

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
      this.currentIndex = 0;
    }
    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
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
        })

      }
    }

  }
  updateLyric() {
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      this.handleLyric();
      this.wyScroll.last.scrollTo(0, 0);
      if (this.playing) {
          this.lyric.play();
      }
    });
  }


  handleLyric() {
    this.lyric.handler.subscribe(({lineNum})=>{
     this.currentLineNum=lineNum;
    })
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



}
