import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';

import { DOCUMENT } from '@angular/common';
import { SetCurrentIndex, SetPlayMode, SetPlayList } from './../../../store/actions/player.action';
import { PlayMode } from './player.type';
import { getSongList, getPlayList, getCurrentIndex, getCurrentSong, getPlayMode, getPlayer } from './../../../store/selectors/player.selector';
import { AppStoreModule } from './../../../store/index';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Song } from 'src/app/data-types/common.types';
import { Subscription, fromEvent } from 'rxjs';
import { shuffle, findIndex } from 'src/app/utils/array';

const modelTypes: PlayMode[] = [
  {
    type: 'loop',
    label: '循环'
  },
  {
    type: 'random',
    label: '随机'
  },
  {
    type: 'singleLoop',
    label: '单曲循环'
  },
]

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  public percent = 0;
  public bufferPercent = 0;
  public songList: Song[];
  public playList: Song[];
  public playMode: PlayMode;
  public currentIndex: number;
  public currentSong: Song;
  public duration: number;
  public currentTime: number;
  public volume: number = 5;
  public showVolumePanel = false;
  public showListPanel=false;
  public selfClick = false;
  public winClick: Subscription;
  public currentMode: PlayMode;
  public modeCount=0;
  public showPanel:boolean=false;

  public playing = false;
  public songReady = false;

  @ViewChild('audio', { static: true })
  private audio: ElementRef;


  private audioEl: HTMLAudioElement;

  @ViewChild(WyPlayerPanelComponent, { static: false })
  public playerPanel: WyPlayerPanelComponent;


  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
  ) {

    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
    


  }

  ngOnInit(): void {
    this.audioEl = this.audio.nativeElement;
  }

  watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }
  watchList(list: Song[], type: string) {
    this[type] = list;
  }

  watchCurrentSong(song: Song) {

    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }

  }
  watchPlayMode(mode: PlayMode) {
    this.currentMode = mode;
    if(this.songList){
      let list=this.songList.slice();
      if(mode.type==='random'){
        list=shuffle(this.songList);
        this.updateCurrentIndex(list,this.currentSong);
      this.store$.dispatch(SetPlayList({playList:list}))
      }
      
    }
  }
  updateCurrentIndex(list: Song[], song: Song) {
    const newIndex=findIndex(list,song);
    this.store$.dispatch(SetCurrentIndex({currentIndex:newIndex}));
  }

 onCanplay() {
    this.songReady = true;
    this.play();
  }
  play() {
    this.audioEl.play();
    this.playing = true;
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '#'
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  onToggle() {

    if (!this.currentSong) {
      if (this.playList.length) {
        this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
        this.songReady = false;
      }
    } else {

      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }

    }
  }

  onPrev(index: number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index <= 0 ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  onNext(index: number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }

  }
  loop() {
    this.audioEl.currentTime = 0;
    this.play();
    this.playerPanel.seekLyric(0);
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  onPercentChange(percent: number) {
    if (this.currentSong) {

      const currentTime=this.duration * (percent / 100)
      this.audioEl.currentTime = currentTime;
      if(this.playerPanel){
        this.playerPanel.seekLyric(currentTime*1000);
      }
      
    }

  }


  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100;
  }

  toggleVolPanel() {
    
    this.togglePanel('showVolumePanel');
  }

  toggleListPanel() {
    
    if(this.songList.length){
      this.togglePanel('showListPanel');
    }
    
  }

  togglePanel(type:string) {

    this[type] = !this[type];
    if (this.showVolumePanel||this.showListPanel) {
      this.bindDocumentClickListener();
    } else {
      this.unbindDocumentClickListener();
    }
  }
  unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }
  bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) {
          this.showVolumePanel = false;
          this.showListPanel=false;
          this.unbindDocumentClickListener();
        }

        this.selfClick = false;
      })
    }
  }

  changeMode() {
    const temp=modelTypes[++this.modeCount%3];
    this.store$.dispatch(SetPlayMode({playMode:temp}))
  }

  onEnded(){
    this.playing=false;
    if(this.currentMode.type==='singleLoop'){
      this.loop();
    }else{
      this.onNext(this.currentIndex=1);
    }
  }

  onChangeSong(song:Song){
    this.updateCurrentIndex(this.playList,song);
  }
}
