
import { SampleBack } from './../data-types/common.types';
import queryString from 'query-string';
import { LoginParams } from './../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';

import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Banner, HotTag ,SongSheet} from '../data-types/common.types';
import {map} from 'rxjs/internal/operators'
import { User, Signin, recordVal, UserRecord, UserSheet } from '../data-types/member.types';

export enum RecordType{
  allData,
  weekData
}

export type LikeSongParams={
  pid:string;
  tracks:string;
}
export type ShareParams={
  id:string;
  msg:string;
  type:string;
}

const records=['allData','weekData'];

@Injectable({
  providedIn: ServicesModule
})
export class MemberService {

   // 获取用户详情
   getUserDetail(uid: string): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify({ uid }) });
    return this.http.get(this.uri + 'user/detail', { params })
    .pipe(map(res => res as User));
  }

  constructor(private http:HttpClient,@Inject(API_CONFIG) private uri:String) { }

  login(formValue:LoginParams):Observable<User>{
    const params=new HttpParams({fromString:queryString.stringify(formValue)});
    return this.http.get(this.uri+'login/cellphone',{params}).pipe(map((res)=>res as User));
  }

  logout():Observable<SampleBack>{
   
    return this.http.get(this.uri+'logout').pipe(map(res=>res as SampleBack));
  }

  signin():Observable<Signin>{

    const params=new HttpParams({fromString:queryString.stringify({type:1})});
    return this.http.get(this.uri+'daily_signin',{params}).pipe(map(res=>res as Signin))
  }

  getUserRecord(uid:string,type=RecordType.weekData):Observable<recordVal[]>{

      const params =new HttpParams({fromString:queryString.stringify({uid,type})});
      return this.http.get(this.uri+'user/record',{params}).pipe(map((res:UserRecord)=>{return res[RecordType[type]]}));

  }

  getUserSheets(uid:string):Observable<UserSheet>{
    const params =new HttpParams({fromString:queryString.stringify({uid})});
      return this.http.get(this.uri+'user/playlist',{params}).pipe(map((res:{playlist:SongSheet[]})=>{
        const list= res.playlist;
        return {
          self:list.filter(item=>!item.subscribed),
          subscribed:list.filter(item=>item.subscribed)
        }
      }));
  }

  likeSong({pid,tracks}:LikeSongParams):Observable<number>{
    const params =new HttpParams({fromString:queryString.stringify({pid,tracks,op:'add'})});
    return this.http.get(this.uri+'playlist/tracks',{params}).pipe(map((res:SampleBack)=>res.code));

  }

  createSheet(name:string):Observable<string>{
    const params =new HttpParams({fromString:queryString.stringify({name})});
    return this.http.get(this.uri+'playlist/create',{params}).pipe(map((res:SampleBack)=>res.id.toString()));
  }

  likeSheet(id:string,t=1):Observable<number>{
    const params =new HttpParams({fromString:queryString.stringify({id,t})});
    return this.http.get(this.uri+'playlist/subscribe',{params}).pipe(map((res:SampleBack)=>res.code))
  }

  shareResource({id,msg,type}:ShareParams):Observable<number>{
    const params =new HttpParams({fromString:queryString.stringify({id,msg,type})});
    return this.http.get(this.uri+'share/resource',{params}).pipe(map((res:SampleBack)=>res.code));

  }

  likeSinger(id:string,t=1):Observable<number>{
    const params =new HttpParams({fromString:queryString.stringify({id,t})});
    return this.http.get(this.uri+'artist/sub',{params}).pipe(map((res:SampleBack)=>res.code))
  }



 

}
