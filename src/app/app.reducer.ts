import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
  ui: fromUi.UIState;
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<any> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer
};

export const getUiState = createFeatureSelector<fromUi.UIState>('ui');
export const getLoading = createSelector(getUiState, fromUi.getLoading);

export const getAuthState = createFeatureSelector<fromAuth.AuthState>('auth');
export const getAuth = createSelector(getAuthState, fromAuth.getAuthentication);