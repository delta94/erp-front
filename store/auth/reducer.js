import { success, error } from '@redux-requests/core';
import {
  LOGIN,
} from './types';

const initialState = {
  user: null,
  isAuthorized: false,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, error: null, loading: true };

    case success(LOGIN):
      return {
        ...state, user: action.response.data.user, loading: false, isAuthorized: true,
      };

    case error(LOGIN):
      return {
        ...state, loading: false, error: action.error, isAuthorized: false,
      };

    default: return state;
  }
};

export default reducer;
