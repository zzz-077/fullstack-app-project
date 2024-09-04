import { createReducer, on } from '@ngrx/store';
import * as chatActions from './chat.actions';
import { APIRESP } from '../../../models/statusModel';

export interface chatState {
  chatData: any[];
}
export const initialChatState: chatState = {
  chatData: [],
};

export const ChatReducer = createReducer(
  initialChatState,
  on(chatActions.chatData, (state, { data }) => ({
    ...state,
    chatData: data,
  }))
);
