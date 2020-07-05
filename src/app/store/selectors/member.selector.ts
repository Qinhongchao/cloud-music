import { MemberState } from './../reducers/member.reducer';
import { createSelector, createFeatureSelector } from '@ngrx/store';


const selectMemberStates=(state:MemberState)=>state;
export const getModalVisible=createSelector(selectMemberStates,(state:MemberState)=>state.modalVisible);
export const getModalType=createSelector(selectMemberStates,(state:MemberState)=>state.modalType);
export const getMember=createFeatureSelector<MemberState>('member');
