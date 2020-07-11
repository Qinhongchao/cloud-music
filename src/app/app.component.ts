import { getMember, getLikeId, getModalVisible, getModalType, getShareInfo } from './store/selectors/member.selector';
import { StorageService } from './services/storage.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { SetModalType, SetUserId, SetModalVisible } from './store/actions/member.action';
import { ModalTypes, ShareInfo } from 'src/app/store/reducers/member.reducer';
import { isEmptyObject } from 'src/app/utils/tools';
import { SearchResult, SongSheet } from './data-types/common.types';
import { SearchService } from './services/search.service';
import { Component } from '@angular/core';
import { AppStoreModule } from './store';
import { Store, select } from '@ngrx/store';
import { MemberService, LikeSongParams, ShareParams } from './services/member.service';
import { User } from './data-types/member.types';
import { codeJson } from './utils/base64';
import { takeUntil } from 'rxjs/internal/operators';

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
  mySheets: SongSheet[];
  likeId: string;
  modalVisible: boolean;
  modalType: ModalTypes;
  shareInfo: ShareInfo;


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

      this.listenStates();

  }


  listenStates() {
    this.store$.pipe(select(getMember),select(getLikeId)).subscribe(likeId=>{
      this.likeId=likeId;
    })

    this.store$.pipe(select(getMember),select(getShareInfo)).subscribe(shareInfo=>{
      if(shareInfo){
        if(this.user){
          this.shareInfo=shareInfo;
          this.openModal(ModalTypes.Share);
        }else{
          this.openModal(ModalTypes.Default);
        }
       
      }
    })
  
  }
  destroy$(destroy$: any): import("rxjs").OperatorFunction<import("./store/reducers/member.reducer").ShareInfo, import("./store/reducers/member.reducer").ShareInfo> {
    throw new Error("Method not implemented.");
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

  let temp:ModalTypes;
    switch (type) {
      case 'loginByPhone':
        temp=ModalTypes.LoginByPhone
        break;
      case 'register':
        temp=ModalTypes.Register
        break;
      case 'share':
        temp=ModalTypes.Share
        break;
      case 'like':
        temp=ModalTypes.Like
        break;
    
      default:
        temp=ModalTypes.Default
        break;
    }

    this.batchActionsService.controlModal(true,temp);
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

  onLoadMySheets(){
    if(this.user){
      this.memberServe.getUserSheets(this.user.profile.userId.toString()).subscribe(userSheet=>{
        this.mySheets=userSheet.self;
        
        this.store$.dispatch(SetModalVisible({modalVisible:true}));
      })
    }else{
      this.openModal(ModalTypes.Default)
    }
  }


  onLikeSong(args:LikeSongParams){

    this.memberServe.likeSong(args).subscribe(()=>{
      this.batchActionsService.controlModal(false);
      this.alertMessage('success','收藏成功');
    },error=>{
      this.alertMessage('error',error.msg||'收藏失败');
    })

  }

  onCreateSheet(sheetName:string){
   this.memberServe.createSheet(sheetName).subscribe(pid=>{
    this.onLikeSong({pid,tracks:this.likeId})
   },error=>{
     this.alertMessage('error',error.msg||"新建歌单失败");
   })
  }

  closeModal(){
    this.batchActionsService.controlModal(false);
  }

  onCancel(){
    this.closeModal();
  }


  onShare(shareParam:ShareParams){
    this.memberServe.shareResource(shareParam).subscribe(()=>{
      this.batchActionsService.controlModal(false);
      this.alertMessage('success','分享成功');
    },error=>{
      this.alertMessage('error',error.msg||'分享失败');
    })
  }


}


