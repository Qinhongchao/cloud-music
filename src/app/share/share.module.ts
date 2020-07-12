import { WyUiModule } from './wy-ui/wy-ui.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { ClickoutsideDirective } from './directives/clickoutside.directive';
import { ImgDefaultDirective } from './directives/img-default.directive';



@NgModule({
 
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    WyUiModule
  ],
  exports:[
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    WyUiModule,
    ImgDefaultDirective
    
  ],
  declarations: [ImgDefaultDirective]
})
export class ShareModule { }
