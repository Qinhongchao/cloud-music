import { SheetService } from './../../services/sheet.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SongSheet } from 'src/app/data-types/common.types';
import { Injectable } from '@angular/core';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet>{

    constructor(private sheetServe:SheetService){

    }

    resolve(route:ActivatedRouteSnapshot):Observable<SongSheet>{

        return this.sheetServe.getSongSheetDetail(Number(route.paramMap.get('id')));

    }

}