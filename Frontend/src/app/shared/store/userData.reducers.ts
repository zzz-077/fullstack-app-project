import { createReducer, on } from '@ngrx/store';
import { USER } from '../../models/userModel';
import * as userActions from './userData.actions';
import { error } from 'console';

export interface userState {
  data: USER[];
  error: string | null;
}
export const initialUserState: userState = {
  data: [],
  error: null,
};

export const UserReducer = createReducer(
  initialUserState,
  on(userActions.getUserDataSuccessfully, (state, { Data }) => ({
    ...state,
    Data,
    error: null,
  })),
  on(userActions.getUserDatafailed, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
