import { SingerService } from './../../services/singer.service';
import { HotTag, SongSheet, Singer } from './../../data-types/common.types';
import { HomeService } from './../../services/home.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner } from 'src/app/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';

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

  constructor(private homeService: HomeService,private singerService:SingerService) {
    this.getBanners();
    this.getHotTags();
    this.getsongSheetList();
    this.getEnterSinger();

  }

  private getBanners() {
    this.homeService.getBanners().subscribe(banners => {
    return  this.banners = banners;
    })
  }

  private getHotTags(){
    this.homeService.getHotTags().subscribe(hotTags=>{
     return  this.hotTags=hotTags;
    })
  }

  private getsongSheetList(){
    this.homeService.getPersonalSheetList().subscribe(songSheets=>{
    return   this.songSheetList=songSheets;
    })
  }

  private getEnterSinger(){
    this.singerService.getEnterSinger().subscribe(singers=>{
    this.singers=singers;
    })
  }

  ngOnInit(): void {
  }
  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

}
