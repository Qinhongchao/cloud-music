import { ShareModule } from './share/share.module';
import { SearchService } from './services/search.service';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';






@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
  
    
  ],
  providers:[SearchService],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
