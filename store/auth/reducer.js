import { success, error } from '@redux-requests/core';
import {
  FETCH_ACCOUNT, LOGIN, LOGOUT,
} from './types';

const initialState = {
  user: null,
  loading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case FETCH_ACCOUNT:
      return { ...state, loading: true };

    case success(LOGOUT):
      return { ...initialState };

    case success(LOGIN):
      return {
        ...state, user: action.response.data.user, loading: false,
      };

    case success(FETCH_ACCOUNT):
      return { ...state, user: action.response.data, loading: false };

    case error(FETCH_ACCOUNT):
    case error(LOGIN):
      return {
        ...state, loading: false,
      };

    default: return state;
  }
};

export default reducer;
