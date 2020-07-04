import { SetPlaying, SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex, SetCurrentAction } from './../actions/player.action';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player.type';
import { Song } from 'src/app/data-types/common.types';
import { createReducer, on, Action } from '@ngrx/store';

export enum CurrentAction{
    Add,
    Play,
    Delete,
    Clear,
    Other
}

export type PlayState={
    playing:boolean;

    playMode:PlayMode;

    songList:Song[];

    playList:Song[];

    currentIndex:number;

    currentAction:CurrentAction;
}

export const  initialState:PlayState={

    playing:false,
    songList:[],
    playList:[],
    playMode:{type:'loop',label:'循环'},
    currentIndex:-1,
    currentAction:CurrentAction.Other,

}

const reducer=createReducer(
    initialState,
    on(SetPlaying,(state,{playing})=>({...state,playing})),
    on(SetPlayList,(state,{playList})=>({...state,playList})),
    on(SetSongList,(state,{songList})=>({...state,songList})),
    on(SetPlayMode,(state,{playMode})=>({...state,playMode})),
    on(SetCurrentAction,(state,{currentAction})=>({...state,currentAction})),
    on(SetCurrentIndex,(state,{currentIndex})=>({...state,currentIndex})),
    
    
)

export function playerReducer(state:PlayState,action:Action){
    return reducer(state,action);
}

