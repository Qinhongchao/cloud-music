import { SheetService } from '../../services/sheet.service';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SongSheet, Song, Lyric } from 'src/app/data-types/common.types';
import { Injectable } from '@angular/core';
import { SongService } from 'src/app/services/song.service';
import { first } from 'rxjs/internal/operators';

type SongDataModel=[Song,Lyric];

@Injectable()
export class SongInfoResolverService implements Resolve<SongDataModel>{

    constructor(private songServe:SongService){

    }

    resolve(route:ActivatedRouteSnapshot):Observable<SongDataModel>{
       const id=route.paramMap.get('id');

       return forkJoin([
           this.songServe.getSongDetail(id),
           this.songServe.getLyric(Number(id))
       ]).pipe(first());

    }

}