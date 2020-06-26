import { SetPlayList, SetSongList, SetCurrentIndex } from './../../store/actions/player.action';
import { AppStoreModule } from './../../store/index';
import { SheetService } from './../../services/sheet.service';
import { SingerService } from './../../services/singer.service';
import { HotTag, SongSheet, Singer } from './../../data-types/common.types';
import { HomeService } from './../../services/home.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner } from 'src/app/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags:HotTag[];
  songSheetList:SongSheet[];
  singers:Singer[];

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent

  constructor(
    private route:ActivatedRoute,
    private sheetService:SheetService,
    private store$:Store<AppStoreModule>
    ) {

    this.route.data.pipe(map(res=>res.homeDatas)).subscribe(
      ([banners,hotTags,songSheetList,singers])=>{
        this.banners=banners;
        this.hotTags=hotTags;
        this.songSheetList=songSheetList;
        this.singers=singers;
      }
    )

  }


  ngOnInit(): void {
  }
  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  onPlaySheet(id:number){
    this.sheetService.playSheet(id).subscribe(list=>{
      this.store$.dispatch(SetSongList({songList:list}));
      this.store$.dispatch(SetPlayList({playList:list}));
      this.store$.dispatch(SetCurrentIndex({currentIndex:0}));
    })
  }

}
