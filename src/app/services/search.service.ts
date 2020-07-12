
import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import {map} from 'rxjs/internal/operators';
import { Singer, SingerDetail, SearchResult } from '../data-types/common.types';
import queryString from 'query-string';



@Injectable({
  providedIn: ServicesModule
})
export class SearchService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: String) { }

  search(keywords: string): Observable<SearchResult>{

    const params = new HttpParams().set('keywords', keywords);
    return this.http.get(this.uri + 'search/suggest', {params}).pipe(map((res: {result: SearchResult}) => res.result));
  }
}
