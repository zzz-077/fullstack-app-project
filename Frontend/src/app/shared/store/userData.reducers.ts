import { createReducer, on } from '@ngrx/store';
import * as userActions from './userData.actions';
import { APIRESP } from '../../models/statusModel';

export interface userState {
  response: APIRESP;
}
export const initialUserState: userState = {
  response: {
    status: '',
    message: '',
    error: null,
    data: [],
  },
};

export const UserReducer = createReducer(
  initialUserState,
  on(userActions.getUserDataSuccessfully, (state, { response }) => ({
    ...state,
    response,
  }))
);
