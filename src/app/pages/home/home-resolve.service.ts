import { Observable, forkJoin, of } from 'rxjs';
import { SingerService } from '../../services/singer.service';
import { HomeService } from '../../services/home.service';
import { HotTag, SongSheet, Banner, Singer } from '../../data-types/common.types';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { first } from 'rxjs/internal/operators';
import { StorageService } from 'src/app/services/storage.service';
import { MemberService } from 'src/app/services/member.service';
import { User } from 'src/app/data-types/member.types';

type HomeDataType=[Banner[],HotTag[],SongSheet[],Singer[],User[]]
@Injectable()
export class HomeResolveService implements Resolve<HomeDataType>{

    constructor(
      private homeService:HomeService,
      private singerService:SingerService,
      private storageServe:StorageService,
      private memberServe:MemberService
      ){


      }

    resolve() :Observable<HomeDataType>{

      const userId=this.storageServe.getStorage('wyUserId');
      let detail$=of(null);
      if(userId){
       detail$= this.memberServe.getUserDetail(userId);
      }
     return  forkJoin([
        this.homeService.getBanners(),
        this.homeService.getHotTags(),
        this.homeService.getPersonalSheetList(),
        this.singerService.getEnterSinger(),
        detail$
      ]).pipe(first())
    }

}