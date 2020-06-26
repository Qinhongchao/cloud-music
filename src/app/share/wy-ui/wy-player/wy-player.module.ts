import { FormatTimePipe } from './../../pipes/format-time.pipe';
import { FormsModule } from '@angular/forms';
import { WySliderModule } from './../wy-slider/wy-slider.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';



@NgModule({
  declarations: [WyPlayerComponent,FormatTimePipe, WyPlayerPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    WySliderModule,
    
  ],
  exports:[WyPlayerComponent,FormatTimePipe]
})
export class WyPlayerModule { }
