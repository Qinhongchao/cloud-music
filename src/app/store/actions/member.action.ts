import { createAction, props } from '@ngrx/store';

import { ModalTypes } from '../reducers/member.reducer';

export const SetModalVisible=createAction('[member] set modalVisible',props<{modalVisible:boolean}>())
export const SetModalType=createAction('[member] set modalType',props<{modalType:ModalTypes}>())
