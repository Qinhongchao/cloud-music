import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  public sliderValue=30;
  public  bufferOffset=80;
  

  constructor() { }

  ngOnInit(): void {
  }

}
