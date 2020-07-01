import { BatchActionsService } from './../../store/batch-actions.service';
import { SheetList } from './../../data-types/common.types';
import { ActivatedRoute, Router } from '@angular/router';
import { SheetParams, SheetService } from './../../services/sheet.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
 

  public listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 1,
    limit: 35,
  }

  public sheets:SheetList;

  public orderValue="hot"

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private sheetServe: SheetService,
    private batchActionsService:BatchActionsService

  ) {

    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit(): void {

  }

  getList() {
    this.sheetServe.getSheets(this.listParams).subscribe(res=>{
      this.sheets=res;
    })
  }

  onPlaySheet(id:number){
    this.sheetServe.playSheet(id).subscribe(list=>{
      this.batchActionsService.selectPlayList({list,index:0});
    })
  }

  onOrderChange(order:'new'|'hot'){
    this.listParams.order=order;
    this.listParams.offset=1;
    this.getList();
  }

  onPageChange(page:number){
    this.listParams.offset=page;
    this.getList();
  }

  toInfo(id:number){
    this.router.navigate(['/sheetInfo',id]);
  }

}
