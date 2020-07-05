
import { SetModalType, SetModalVisible } from './actions/member.action';
import { getMember } from './selectors/member.selector';
import { AppStoreModule } from './index';
import { Injectable } from '@angular/core';
import { Song } from '../data-types/common.types';
import { Store, select } from '@ngrx/store';
import { getPlayer } from './selectors/player.selector';
import { PlayState, CurrentAction } from './reducers/player.reducer';
import { SetSongList, SetPlayList, SetCurrentIndex, SetCurrentAction } from './actions/player.action';
import { shuffle, findIndex } from '../utils/array';
import { MemberState, ModalTypes } from './reducers/member.reducer';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {

  private playerState: PlayState;

  private memberState:MemberState;

  constructor(private store$: Store<AppStoreModule>) {

    this.store$.pipe(select(getPlayer)).subscribe(playerState => {
      this.playerState = <PlayState>playerState;
    })

    this.store$.pipe(select(getMember)).subscribe(memberState=>{
        this.memberState=<MemberState>memberState;
    })
  }

  selectPlayList({ list, index }: { list: Song[], index: number }) {

    this.store$.dispatch(SetSongList({ songList: list }));

    let trueIndex = index;
    let trueList: Song[] = list.slice();

    if (this.playerState.playMode.type === 'random') {
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList, list[trueIndex])
    }

    this.store$.dispatch(SetPlayList({ playList: trueList }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
    this.store$.dispatch(SetCurrentAction({currentAction:CurrentAction.Play}))
  }

  deleteSong(song: Song) {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let currentIndex = this.playerState.currentIndex;
    const sIndex = findIndex(songList, song);
    songList.splice(sIndex, 1);
    const pIndex = findIndex(playList, song);
    playList.splice(pIndex, 1);
    if (currentIndex > pIndex || currentIndex === playList.length) {
      currentIndex--;
    }

    this.store$.dispatch(SetSongList({ songList }));
    this.store$.dispatch(SetPlayList({ playList }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex }));
    this.store$.dispatch(SetCurrentAction({currentAction:CurrentAction.Delete}))
  }

  clearSong() {

    this.store$.dispatch(SetSongList({ songList: [] }));
    this.store$.dispatch(SetPlayList({ playList: [] }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
    this.store$.dispatch(SetCurrentAction({currentAction:CurrentAction.Clear}))
  }

  insertSong(song:Song,isPlay:boolean){
    const songList=this.playerState.songList.slice();
    const playList=this.playerState.playList.slice();

    let insertIndex=this.playerState.currentIndex;
    const pIndex=findIndex(playList,song);

    if(pIndex>-1){

      if(isPlay){
        insertIndex=pIndex;
      }
      
    }else{
      songList.push(song);
      playList.push(song);
      if(isPlay){
        insertIndex=songList.length-1;
      }

      this.store$.dispatch(SetSongList({songList}));
      this.store$.dispatch(SetPlayList({playList}));
      this.store$.dispatch(SetCurrentAction({currentAction:CurrentAction.Add}))
    }

    if(insertIndex!=this.playerState.currentIndex){
      this.store$.dispatch(SetCurrentIndex({currentIndex:insertIndex}))
      this.store$.dispatch(SetCurrentAction({currentAction:CurrentAction.Play}))
    }else{
      this.store$.dispatch(SetCurrentAction({currentAction:CurrentAction.Add}))
    }
    
  }

  insertSongs(songs:Song[]){
    const songList=this.playerState.songList.slice();
    const playList=this.playerState.playList.slice();
    songs.forEach(item=>{
      const pIndex=findIndex(playList,item);
      if(pIndex===-1){
        songList.push(item);
        playList.push(item);
      }
    })

    this.store$.dispatch(SetSongList({songList}));
      this.store$.dispatch(SetPlayList({playList}));
      this.store$.dispatch(SetCurrentAction({currentAction:CurrentAction.Add}))
  }


  controlModal(modalVisible=true,modalType?:ModalTypes){

    if(modalType){
      this.store$.dispatch(SetModalType({modalType}));
    }
    
    this.store$.dispatch(SetModalVisible({modalVisible}));
  }
}
