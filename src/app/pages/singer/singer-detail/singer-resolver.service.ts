
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SongSheet, Song, Lyric, SingerDetail, Singer } from 'src/app/data-types/common.types';
import { Injectable } from '@angular/core';
import { SongService } from 'src/app/services/song.service';
import { first } from 'rxjs/internal/operators';
import { SingerService } from 'src/app/services/singer.service';

type SingerDetailDataModel=[SingerDetail,Singer[]];

@Injectable()
export class SingerResolverService implements Resolve<SingerDetailDataModel>{

    constructor(private singerServe:SingerService){

    }

    resolve(route:ActivatedRouteSnapshot):Observable<SingerDetailDataModel>{

       const id=route.paramMap.get('id');
       return forkJoin([
        this.singerServe.getSingerDetail(id),
        this.singerServe.getSimiSinger(id)
       ]).pipe(first())

       

    }

}