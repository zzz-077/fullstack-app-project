import { createReducer, on } from '@ngrx/store';
import { APIRESP } from '../../../models/statusModel';
import { chatsDataForUser } from './chats.actions';

export interface AllchatState {
  data: APIRESP;
}
export const initialChatsForUser: AllchatState = {
  data: {
    status: '',
    message: '',
    error: null,
    data: [],
  },
};

export const ChatsForUserReducer = createReducer(
  initialChatsForUser,
  on(chatsDataForUser, (state, { data }) => ({
    ...state,
    data: data,
  }))
);
