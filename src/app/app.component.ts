import { StorageService } from './services/storage.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { SetModalType, SetUserId } from './store/actions/member.action';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { isEmptyObject } from 'src/app/utils/tools';
import { SearchResult } from './data-types/common.types';
import { SearchService } from './services/search.service';
import { Component } from '@angular/core';
import { AppStoreModule } from './store';
import { Store } from '@ngrx/store';
import { MemberService } from './services/member.service';
import { User } from './data-types/member.types';
import { codeJson } from './utils/base64';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'cloud-music';
  menu=[
    {
      label:'发现',
      path:'/home'
    },
    {
      label:'歌单',
      path:'/sheet'
    }
  ]

  public searchResult:SearchResult;
  user: User;
  wyRememberLogin:LoginParams;


  constructor(
    private searchServe:SearchService,
    private store$:Store<AppStoreModule>,
    private batchActionsService: BatchActionsService,
    private memberServe:MemberService,
    private messageServe:NzMessageService,
    private storageServe:StorageService
    ){

     
     const userId=storageServe.getStorage('wyUserId');
      if(userId){
        this.memberServe.getUserDetail(userId).subscribe(res=>this.user=res);
        this.store$.dispatch(SetUserId({userId}))
      }

     
      const wyRememberLogin=this.storageServe.getStorage('wyRememberLogin');
      if(wyRememberLogin){
        this.wyRememberLogin=JSON.parse(wyRememberLogin);
      }

  }

  onSearch(keywords:string){
    if(keywords){
      this.searchServe.search(keywords).subscribe((res)=>{
        
        this.searchResult=this.highlightKeywords(keywords,res);
       
      })
    }else{
      this.searchResult={};
    }
  }
  highlightKeywords(keywords:string,result:SearchResult): SearchResult {
    if(!isEmptyObject(result)){
      const reg=new RegExp(keywords,'ig');
      ['artists','playlists','songs'].forEach(type=>{
        if(result[type]){
          result[type].forEach(item=>{
            item.name=item.name.replace(reg,'<span class="highlight">$&</span>');
          })
        }
      })
    }

    return result;
  }

  onChangeModalType(modalType=ModalTypes.Default){
    this.store$.dispatch(SetModalType({modalType}));
  }


  openModal(type:string){
    this.batchActionsService.controlModal(true,ModalTypes[type]);
  }

  onLogin(params:LoginParams){

    this.doLogin(params);
  }

  doLogin(params:LoginParams) {
    this.memberServe.login(params).subscribe(user=>{
      this.user=user;
      this.batchActionsService.controlModal(false);
      this.alertMessage('success','登录成功');
      this.storageServe.setStorage({key:'wyUserId',value:user.profile.userId.toString()})
      this.store$.dispatch(SetUserId({userId:user.profile.userId.toString()}))

      if(params.remember){
       
        this.storageServe.setStorage({key:'wyRememberLogin',value:JSON.stringify(codeJson(params))});
      }else{
        
        this.storageServe.removeStorage('wyRememberLogin');


      }
    },error=>{
      this.alertMessage('error',error.message||'登录失败');
    })

  }

  alertMessage(type:string,msg:string) {
    this.messageServe.create(type,msg);
  }

  onLogout(){
    this.memberServe.logout().subscribe(res=>{
      this.user=null;
     
      this.storageServe.removeStorage('wyUserId');
      this.store$.dispatch(SetUserId({userId:''}))
      this.alertMessage('success','退出成功');

    },
    (error)=>{
      this.alertMessage('error',error.message||'退出失败')
    }
    )
  }


}


