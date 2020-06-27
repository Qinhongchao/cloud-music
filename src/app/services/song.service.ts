import { Lyric } from './../data-types/common.types';
import { SongSheet, SongUrl, Song } from '../data-types/common.types';

import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import {map} from 'rxjs/internal/operators'
import { Singer } from '../data-types/common.types';
import queryString from 'query-string'



@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private http:HttpClient,@Inject(API_CONFIG) private uri:String) { }

  getSongUrl(ids:string):Observable<SongUrl[]>{
    const params=new HttpParams().set('id',ids)
    return this.http.get(this.uri+'song/url',{params}).pipe(map((res:{data:SongUrl[]})=>res.data));
  }

  getSongList(songs:Song|Song[]):Observable<Song[]>{
    const songArr=Array.isArray(songs)?songs.slice():[songs];
    const ids=songArr.map(item=>item.id).join(',');
    return this.getSongUrl(ids).pipe(map(urls=>this.generateSongList(songArr,urls)));
  }
  generateSongList(songs: Song[], urls: SongUrl[]) {
    const result=[];
    songs.forEach(song=>{
      const url=urls.find(url=>url.id===song.id).url;
      if(url){
      
        result.push({...song,url});
      }
    })

    return result;
  }

  getLyric(id:number):Observable<Lyric>{
    const params=new HttpParams().set('id',id.toString());
  return this.http.get(this.uri+'lyric',{params}).pipe(map(
    (res:{[key:string]:{lyric:string}})=>{
      return {
        lyric:res.lrc.lyric,
        tlyric:res.tlyric.lyric
      }
    }
  ));
  }
}
