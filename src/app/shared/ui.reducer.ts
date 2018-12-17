import { UIActions, START_LOADING, STOP_LOADING } from './ui.actions';

export interface UIState {
  loading: boolean
}

const initialState: UIState = {
  loading: false
};

export function uiReducer(state = initialState, action: UIActions) {
  switch (action.type) {
    case START_LOADING:
      return {
        loading: true
      };
    case STOP_LOADING:
      return {
        loading: false
      };
    default:
      return {
        state
      }
  }
}

export const getLoading = (state: UIState) => state.loading;