import { FormsModule } from '@angular/forms';
import { WySliderModule } from './../wy-slider/wy-slider.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';



@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    CommonModule,
    FormsModule,
    WySliderModule,
    
  ],
  exports:[WyPlayerComponent]
})
export class WyPlayerModule { }
