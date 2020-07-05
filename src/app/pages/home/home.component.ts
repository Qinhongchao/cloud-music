import { BatchActionsService } from './../../store/batch-actions.service';
import { getPlayer } from './../../store/selectors/player.selector';
import { shuffle, findIndex } from 'src/app/utils/array';
import { SetPlayList, SetSongList, SetCurrentIndex } from './../../store/actions/player.action';
import { AppStoreModule } from './../../store/index';
import { SheetService } from './../../services/sheet.service';
import { SingerService } from './../../services/singer.service';
import { HotTag, SongSheet, Singer, Song } from './../../data-types/common.types';
import { HomeService } from './../../services/home.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner } from 'src/app/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { Store, select } from '@ngrx/store';
import { PlayState } from 'src/app/store/reducers/player.reducer';

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
  private playerState:PlayState;

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private sheetService:SheetService,
    private batchActionsService:BatchActionsService,

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
    this.batchActionsService.selectPlayList({list,index:0});
    })
  }

  toInfo(id:number){
    this.router.navigate(['/sheetInfo',id]);
  }

  openModal(){
    this.batchActionsService.controlModal();
  }

}
