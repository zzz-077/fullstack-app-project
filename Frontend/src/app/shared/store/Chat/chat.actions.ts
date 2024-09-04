import { createAction, props } from '@ngrx/store';
import { APIRESP } from '../../../models/statusModel';

export const chatData = createAction(
  '[chat] chatData',
  props<{ data: any[] }>()
);
