import { SongSheet } from './../../../data-types/common.types';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less']
})
export class SingleSheetComponent implements OnInit {

  @Output()
  onPlay=new EventEmitter<number>();

  @Input()
  sheet:SongSheet;
  
  constructor() { }

  ngOnInit(): void {
  }

  playSheet(event:MouseEvent,id:number){
    event.stopPropagation();
    this.onPlay.emit(id);
  }

  get coverImg():string{
    return this.sheet.picUrl||this.sheet.coverImgUrl;
}



}
