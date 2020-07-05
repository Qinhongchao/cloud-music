import { NzMessageService } from 'ng-zorro-antd';
import { MemberService } from 'src/app/services/member.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { User } from 'src/app/data-types/member.types';
import { timer } from 'rxjs';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {

  public point:number;
  public tipTitle:string='';
  public showTips:boolean=false;
  @Output() openModal=new EventEmitter<void>();
  @Input() user:User;
  constructor(private memberServe:MemberService,private messageServe:NzMessageService) { }

  ngOnInit(): void {
  }

  onSignin(){
    this.memberServe.signin().subscribe(res=>{
      this.point=res.point;
      this.showTips=true;
      this.tipTitle='积分+'+this.point;
      this.messageServe.create('success','签到成功');
      timer(1500).subscribe(()=>{
        this.showTips=false;
        this.tipTitle='';
      })
    },
    (error)=>{
      this.messageServe.create('error',error.message||'签到失败');
    })
  }

}
