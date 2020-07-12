import { environment } from './../../environments/environment.prod';
import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorProviders } from './http-interceptors';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');


@NgModule({
  declarations: [],
  imports: [

  ],
  providers: [
    {provide: API_CONFIG, useValue: '/api/'},
    {
      provide: WINDOW,
      useFactory(platformId: Object): Window|Object{
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [PLATFORM_ID]
    },
    HttpInterceptorProviders
  ]
})
export class ServicesModule { }
