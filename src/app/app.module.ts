
import { SearchService } from './services/search.service';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';







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
