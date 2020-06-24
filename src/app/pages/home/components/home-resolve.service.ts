import { Observable, forkJoin } from 'rxjs';
import { SingerService } from './../../../services/singer.service';
import { HomeService } from './../../../services/home.service';
import { HotTag, SongSheet, Banner, Singer } from './../../../data-types/common.types';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { first } from 'rxjs/internal/operators';

type HomeDataType=[Banner[],HotTag[],SongSheet[],Singer[]]
@Injectable()
export class HomeResolveService implements Resolve<HomeDataType>{

    constructor(private homeService:HomeService,private singerService:SingerService){}

    resolve() :Observable<HomeDataType>{
     return  forkJoin([
        this.homeService.getBanners(),
        this.homeService.getHotTags(),
        this.homeService.getPersonalSheetList(),
        this.singerService.getEnterSinger()
      ]).pipe(first())
    }

}