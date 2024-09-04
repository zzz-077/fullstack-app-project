import { createAction, props } from '@ngrx/store';
import { APIRESP } from '../../../models/statusModel';

export const userData = createAction('[USER] userData');
export const getUserDataSuccessfully = createAction(
  '[USER] getUserDataSuccessfully',
  props<{ response: APIRESP }>()
);
