import { SongSheet } from './../../../data-types/common.types';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less']
})
export class SingleSheetComponent implements OnInit {

  @Input()
  sheet:SongSheet;
  
  constructor() { }

  ngOnInit(): void {
  }

}
