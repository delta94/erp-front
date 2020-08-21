import { success, error } from '@redux-requests/core';
import {
  FETCH_USER_ROLES,
  FETCH_USERS,
} from './types';

const initialState = {
  data: [],
  roles: [],
  total: 0,
  loading: false,
  rolesLoading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, loading: true };

    case FETCH_USER_ROLES:
      return { ...state, rolesLoading: true };

    case success(FETCH_USERS):
      return {
        ...state,
        data: action.response.data.data.map((user) => ({
          key: user.id,
          ...user,
        })),
        total: action.response.data.total,
        loading: false,
      };

    case success(FETCH_USER_ROLES):
      return {
        ...state,
        roles: action.response.data.data,
        rolesLoading: false,
      };

    case error(FETCH_USERS):
      return {
        ...state, loading: false,
      };

    case error(FETCH_USER_ROLES):
      return {
        ...state, rolesLoading: false,
      };

    default: return state;
  }
};

export default reducer;
