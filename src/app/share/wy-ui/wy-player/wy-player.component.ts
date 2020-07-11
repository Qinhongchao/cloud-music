import { BatchActionsService } from './../../../store/batch-actions.service';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';

import { DOCUMENT } from '@angular/common';
import { SetCurrentIndex, SetPlayMode, SetPlayList, SetSongList, SetCurrentAction } from './../../../store/actions/player.action';
import { PlayMode } from './player.type';
import { getSongList, getPlayList, getCurrentIndex, getCurrentSong, getPlayMode, getPlayer, getCurrentAction } from './../../../store/selectors/player.selector';
import { AppStoreModule } from './../../../store/index';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Song, SongSheet, Singer } from 'src/app/data-types/common.types';
import { Subscription, fromEvent, timer } from 'rxjs';
import { shuffle, findIndex } from 'src/app/utils/array';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { CurrentAction } from 'src/app/store/reducers/player.reducer';
import { R3TargetBinder } from '@angular/compiler';
import { SetShareInfo } from 'src/app/store/actions/member.action';

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

enum TipTitles {
  Add = '已添加到列表',
  Play = '正在播放歌曲',
  Delete = '已删除歌曲',
  Clear = '已清空列表',
}

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  animations: [
    trigger('showHide', [
      state('show', style({ bottom: 0 })),
      state('hide', style({ bottom: -71 })),
      transition('show=>hide', [animate('0.3s')]),
      transition('hode=>show', [animate('0.2s')])
    ]),


  ]
})
export class WyPlayerComponent implements OnInit {


  isLocked = false;
  showPlayer = 'hide';
  animating = false;
  controlTooltip = {
    title: '',
    show: false,
  }
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
  public showListPanel = false;
  public bindFlag = false;
  public winClick: Subscription;
  public currentMode: PlayMode;
  public modeCount = 0;
  public showPanel: boolean = false;

  public playing = false;
  public songReady = false;



  @ViewChild('audio', { static: true })
  private audio: ElementRef;


  private audioEl: HTMLAudioElement;

  @ViewChild(WyPlayerPanelComponent, { static: false })
  public playerPanel: WyPlayerPanelComponent;


  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalService: NzModalService,
    private batchActionsService: BatchActionsService,
    private router: Router,
    private batchActionServe: BatchActionsService,

  ) {

    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
    appStore$.pipe(select(getCurrentAction)).subscribe(currentAction => this.watchCurrenAction(currentAction));



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
    this.currentSong = song;
    if (song) {

      this.duration = song.dt / 1000;
    }

  }

  watchCurrenAction(currentAction: CurrentAction): void {

    const title = TipTitles[CurrentAction[currentAction]];
    if (title) {
      this.controlTooltip.title = title;
      if (this.showPlayer === 'hide') {
        this.togglePlayer("show");
        this.showToolTip();
      } else {
        this.showToolTip();
      }

    }

    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentAction.Other }))
  }
  showToolTip() {
    this.controlTooltip.show = true;
    timer(1500).subscribe(() => {
      this.controlTooltip = {
        title: '',
        show: false
      }
    })
  }

  onAnimateDone(event: AnimationEvent) {
    this.animating = false;
    if (event.toState === 'show' && this.controlTooltip.title) {
      this.showToolTip();
    }

  }
  watchPlayMode(mode: PlayMode) {
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);

      }

      this.updateCurrentIndex(list, this.currentSong);
      this.store$.dispatch(SetPlayList({ playList: list }))

    }
  }
  updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = findIndex(list, song);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
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

      const currentTime = this.duration * (percent / 100)
      this.audioEl.currentTime = currentTime;
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000);
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

    if (this.songList.length) {
      this.togglePanel('showListPanel');
    }

  }

  togglePanel(type: string) {

    this[type] = !this[type];
    if (this.showVolumePanel || this.showListPanel) {
      this.bindFlag = true;
    } else {
      this.bindFlag = false;
    }
  }


  changeMode() {
    const temp = modelTypes[++this.modeCount % 3];
    this.store$.dispatch(SetPlayMode({ playMode: temp }))
  }

  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex = 1);
    }
  }

  onChangeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song);
  }

  onClearSong(event: any) {

    this.nzModalService.confirm({
      nzTitle: '确认删除列表？',
      nzOnOk: () => {
        this.batchActionsService.clearSong();
      }
    })

  }

  onDeleteSong(song: Song) {
    this.batchActionsService.deleteSong(song);
  }

  onClickOutSide(target: HTMLElement) {

    if (target.dataset.act !== 'delete') {
      this.showVolumePanel = false;
      this.showListPanel = false;
      this.bindFlag = false;
    }


  }

  toInfo(path: [string, number]) {

    console.log('path', path);
    this.showVolumePanel = false;
    this.showPanel = false;
    this.router.navigate(path);
  }

  togglePlayer(type: string) {
    if (!this.isLocked && !this.animating) {
      this.showPlayer = type;
    }
  }

  onError() {
    this.playing = false;
    this.bufferPercent = 0;
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
