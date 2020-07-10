import { getMember, getLikeId } from './../../../../store/selectors/member.selector';
import { AppStoreModule } from './../../../../store/index';
import { SongSheet } from 'src/app/data-types/common.types';
import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LikeSongParams } from 'src/app/services/member.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit ,OnChanges{

  @Input() mySheets:SongSheet[];

  @Input() likeId:string;

  @Output() onLikeSong=new EventEmitter<LikeSongParams>();

  @Output() onCreateSheet=new EventEmitter<string>();

  creating=false;

  formModel:FormGroup;

  constructor(private fb:FormBuilder) { 

    this.formModel=this.fb.group({
      sheetName:['',[Validators.required]]
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
 
  }

  ngOnInit(): void {
  }

  onLike(pid:string){
    this.onLikeSong.emit({pid,tracks:this.likeId});
  }

  onSubmit(){
    this.creating=false;
   this.onCreateSheet.emit(this.formModel.get('sheetName').value);
  }

}
