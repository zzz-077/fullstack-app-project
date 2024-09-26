import { createAction, props } from '@ngrx/store';
import { APIRESP } from '../../../models/statusModel';

export const chatsData = createAction('[chats] chatsData');
export const chatsDataForUser = createAction(
  '[chats] AllchatsForUser',
  props<{ data: APIRESP }>()
);
