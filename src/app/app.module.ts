import { CoreModule } from './core/core.module';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ShareModule } from './share/share.module';






@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
