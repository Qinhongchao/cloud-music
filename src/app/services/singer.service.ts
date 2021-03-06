
import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import {map} from 'rxjs/internal/operators'
import { Singer, SingerDetail } from '../data-types/common.types';
import queryString from 'query-string'

type SingerParams={
  offset:number;
  limit:number;
  cat?:string;
}

const defaultParams:SingerParams={
  offset:0,
  limit:9,
  cat:'5001'
}

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private http:HttpClient,@Inject(API_CONFIG) private uri:String) { }

  getEnterSinger(args?:SingerParams):Observable<Singer[]>{
    const params=new HttpParams({fromString:queryString.stringify(args)})
    return this.http.get(this.uri+'artist/list',{params}).pipe(map((res:{artists:Singer[]})=>res.artists.slice(0,10)));
  }

  getSingerDetail(id:string):Observable<SingerDetail>{
    const params=new HttpParams().set('id',id);
    return this.http.get(this.uri+'artists',{params}).pipe(map(res=>res as SingerDetail));
  }

  getSimiSinger(id:string):Observable<Singer[]>{
    const params=new HttpParams().set('id',id);
    return this.http.get(this.uri+'simi/artist',{params}).pipe(map((res:{artists:Singer[]})=>res.artists));
  }
}
