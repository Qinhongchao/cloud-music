import { ShareInfo } from './../reducers/member.reducer';
import { createAction, props } from '@ngrx/store';

import { ModalTypes } from '../reducers/member.reducer';

export const SetModalVisible=createAction('[member] set modalVisible',props<{modalVisible:boolean}>());
export const SetModalType=createAction('[member] set modalType',props<{modalType:ModalTypes}>());
export const SetUserId=createAction('[member] set userId',props<{userId:string}>());
export const SetLikeId=createAction('[member] set likeId',props<{likeId:string}>());
export const SetShareInfo=createAction('[member] set shareInfo',props<{shareInfo:ShareInfo}>());
