import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AllchatState } from './chats.reducers';

export const selectUserChatsSelector =
  createFeatureSelector<AllchatState>('AllUserChats');

export const SelectuserChats = createSelector(
  selectUserChatsSelector,
  (state) => state.data
);
