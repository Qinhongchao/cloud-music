import { WINDOW } from './../../../../services/services.module';
import { WyScrollComponent } from './../wy-scroll/wy-scroll.component';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList, Inject } from '@angular/core';
import { Song } from 'src/app/data-types/common.types';
import { findIndex } from 'src/app/utils/array';
import { timer } from 'rxjs';




@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit,OnChanges {

  @Input() songList:Song[];
  @Input() currentSong:Song;
  currentIndex:number;
  @Input() show:boolean;

  @Output() onClose=new EventEmitter<void>();
  @Output() onChangeSong=new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) private wyScroll:QueryList<WyScrollComponent>;

  public scrollY:number=0;

  constructor(@Inject(WINDOW) private win:Window) { }


  ngOnInit(): void {
  }

    
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['songList']){
      this.currentIndex=0;
    }
    if(changes['currentSong']){
      if(this.currentSong){
        this.currentIndex=findIndex(this.songList,this.currentSong);
        if(this.show){
          this.scrollToCurrent();
        }
      }
    }
    if(changes['show']){
      if(!changes['show'].firstChange&& this.show){
          this.wyScroll.first.refreshScroll();
          timer(80).subscribe(()=>{
            if(this.currentSong){
              this.scrollToCurrent(0);
            }
          })
       /*    setTimeout(()=>{
            if(this.currentSong){
              this.scrollToCurrent(0);
            }
          },80) */
          
      }
    }
    
  }
  scrollToCurrent(speed=300) {
    const songListRefs=this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if(songListRefs.length){
      const currentLi=<HTMLElement>songListRefs[this.currentIndex||0];
      const offsetHeight=currentLi.offsetHeight;
      const offsetTop=currentLi.offsetTop;
      if(((offsetTop-Math.abs(this.scrollY))>offsetHeight*5)||(offsetTop<Math.abs(this.scrollY))){
        this.wyScroll.first.scrollToElement(currentLi,speed,false,false);
      }
    }
  }



}
