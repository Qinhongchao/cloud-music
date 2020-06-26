import { environment } from './../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './reducers/player.reducer';




@NgModule({
  declarations: [],
  imports: [
   StoreModule.forRoot({player:playerReducer},{
     runtimeChecks:{
       strictActionImmutability:true,
       strictStateImmutability:true,
       strictStateSerializability:true,
       strictActionSerializability:true
     }
   }),
   StoreDevtoolsModule.instrument({
     maxAge:20,
     logOnly:environment.production

   })
  ]
})
export class AppStoreModule { }
