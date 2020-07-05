import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { codeJson } from 'src/app/utils/base64';

export type LoginParams={
  phone:number;
  password:string|number;
  remember:boolean;
}

@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLoginComponent implements OnInit ,OnChanges{

  @Input() wyRememberLogin:LoginParams;
  @Output() onChangeModalType=new EventEmitter<string|void>();
  @Output() onLogin=new EventEmitter<LoginParams>();

  formModel:FormGroup;
  constructor(private fb:FormBuilder) {

   
   }
  ngOnChanges(changes: SimpleChanges): void {
    
    const userLoginParams= changes['wyRememberLogin'];

    if(userLoginParams){

      let phone='';
      let password='';
      let remember=false;
      
      if(userLoginParams.currentValue){
        const value=codeJson(userLoginParams.currentValue,'decode');
        phone=value.phone;
        password=value.password;
        remember=value.remember;
      }
      
      this.setModel({phone,password,remember})

    }
  }
  setModel({ phone,password, remember }) {
    this.formModel=this.fb.group({
      phone:[phone,[Validators.required,Validators.pattern(/^1\d{10}$/)]],
      password:[password,[Validators.required,Validators.minLength(6)]],
      remember:[remember]
    })
  }

  ngOnInit(): void {
  }

  onSubmit(){
    const model=this.formModel;
    if(model.valid){
      this.onLogin.emit(model.value);
    }
    
  }

}
