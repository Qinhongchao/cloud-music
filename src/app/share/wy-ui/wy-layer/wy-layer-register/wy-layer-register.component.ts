import { ModalTypes } from './../../../../store/reducers/member.reducer';
import { NzMessageService } from 'ng-zorro-antd';
import { MemberService } from 'src/app/services/member.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { take } from 'rxjs/internal/operators';
import { interval } from 'rxjs';
import { error } from 'protractor';

enum Exist {
  '存在'=1,
  '不存在'=-1,

}


@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit {

  @Output() onChangeModalType=new EventEmitter<string|void>();
  @Output() onRegister=new EventEmitter<string>();
  timing:number;
  showCode=false;
  formModel:FormGroup;
  codePass:string|boolean='';
  constructor(private fb:FormBuilder,
    private memberServe:MemberService,
    private messageServe:NzMessageService,
    private cdr:ChangeDetectorRef
    ) { 
    this.formModel=this.fb.group({
      phone:['',[Validators.required,Validators.pattern(/^1\d{10}$/)]],
      password:['',[Validators.required,Validators.minLength(6)]]
    })

   }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.formModel.valid){
      this.sendCode()
    }
    
  }


  sendCode() {
    this.memberServe.sendCode(this.formModel.get('phone').value).subscribe(()=>{
      this.timing=10;
      if(!this.showCode){
        this.showCode=true;
      }
      this.cdr.markForCheck();
      interval(1000).pipe(take(10)).subscribe(()=>{
        this.timing--;
        this.cdr.markForCheck();
      });
    },error=>{
      this.messageServe.error(error.message);
    })
  }

  changeType(type=ModalTypes.Default){
    this.showCode=false;
    this.formModel.reset();
  }

  onCheckCode(code:string){
    this.memberServe.checkCode(this.formModel.get('phone').value,Number(code)).subscribe(()=>{
      this.codePass=true;
    },error=>{
      this.codePass=false;
    },this.cdr.markForCheck)
  }

  onCheckExist(phone:string){
    this.memberServe.checkExist(Number(phone)).subscribe((res)=>{
      if((Exist[res]==='存在')){
        this.messageServe.error('账号已存在,可直接登录');
        this.changeType(ModalTypes.LoginByPhone);
      }else{
        this.onRegister.emit(phone);
      }
    })
  }

}
