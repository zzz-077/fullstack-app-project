import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userState } from './userData.reducers';

export const selectUserSelector = createFeatureSelector<userState>('data');

export const selectUserData = createSelector(
  selectUserSelector,
  (state) => state.data
);
export const selectUserError = createSelector(
  selectUserSelector,
  (state) => state.error
);
