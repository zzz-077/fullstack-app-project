import { createFeatureSelector, createSelector } from '@ngrx/store';
import { chatState } from './chat.reducers';

export const selectChatSelector = createFeatureSelector<chatState>('chat');

export const selectChatData = createSelector(
  selectChatSelector,
  (state: chatState) => state.chatData
);
