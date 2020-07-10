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
 

}
