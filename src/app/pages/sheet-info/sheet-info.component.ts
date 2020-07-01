import { SongSheet } from './../../data-types/common.types';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit {
 

  public sheetInfo:SongSheet;
  public description={
    short:'',
    long:''
  }

  controlDesc={
    isExpand:false,
    label:'展开',
    iconCls:'down'
  }

  constructor(private route:ActivatedRoute) {

    this.route.data.pipe(map(res=>res.sheetInfo)).subscribe(res=>{
     this.sheetInfo=res;
     if(res.description){
       this.changeDesc(res.description);
     }
    })
   }

  ngOnInit(): void {
  }

  changeDesc(desc: string) {
    if(desc.length<99){
     
      this.description={
       
        short:this.replaceBr('<b>介绍:</b>'+desc),
        long:''
      }

    }else{
    
      this.description={
        
        short:this.replaceBr('<b>介绍:</b>'+desc.slice(0,99)+'...'),
        long:this.replaceBr('<b>介绍:</b>'+desc)
      }
    }
  }

  toggleDesc(){
    this.controlDesc.isExpand=!this.controlDesc.isExpand;

    if(this.controlDesc.isExpand){
      this.controlDesc.label="收起";
      this.controlDesc.iconCls='up';
    }else{
      this.controlDesc.label='展开';
      this.controlDesc.iconCls='down'
    }
  }
  
  private replaceBr(str:string):string{
    return str.replace(/\n/g,'<br/>');
  }
}
