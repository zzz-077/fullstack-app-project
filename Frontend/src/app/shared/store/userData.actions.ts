import { createAction, props } from '@ngrx/store';
import { USER } from '../../models/userModel';

export const userData = createAction('[USER] userData');
export const getUserDataSuccessfully = createAction(
  '[USER] getUserDataSuccessfully',
  props<{ Data: USER[] }>()
);
export const getUserDatafailed = createAction(
  '[USER] getUserDatafailed',
  props<{ error: string | null }>()
);
