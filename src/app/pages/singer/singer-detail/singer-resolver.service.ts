
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SongSheet, Song, Lyric, SingerDetail } from 'src/app/data-types/common.types';
import { Injectable } from '@angular/core';
import { SongService } from 'src/app/services/song.service';
import { first } from 'rxjs/internal/operators';
import { SingerService } from 'src/app/services/singer.service';



@Injectable()
export class SingerResolverService implements Resolve<SingerDetail>{

    constructor(private singerServe:SingerService){

    }

    resolve(route:ActivatedRouteSnapshot):Observable<SingerDetail>{
       const id=route.paramMap.get('id');

       return this.singerServe.getSingerDetail(id);

    }

}