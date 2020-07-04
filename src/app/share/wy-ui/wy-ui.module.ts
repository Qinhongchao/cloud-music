import { WySearchModule } from './wy-search/wy-search.module';
import { WySliderModule } from './wy-slider/wy-slider.module';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';

@NgModule({
  declarations: [SingleSheetComponent,PlayCountPipe],
  imports: [
   WyPlayerModule,
   WySliderModule,
   WySearchModule
  ],
  exports:[SingleSheetComponent,PlayCountPipe,WyPlayerModule,WySearchModule]
})
export class WyUiModule { }
