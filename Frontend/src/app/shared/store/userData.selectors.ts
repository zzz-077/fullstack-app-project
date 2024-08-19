import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userState } from './userData.reducers';

export const selectUserSelector = createFeatureSelector<userState>('user');

export const selectUserData = createSelector(
  selectUserSelector,
  (state) => state.response
);
