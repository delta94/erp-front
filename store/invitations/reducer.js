import { error, success } from '@redux-requests/core';
import { FETCH_INVITATIONS } from './types';

const initialState = {
  data: [],
  total: 0,
  loading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INVITATIONS:
      return { ...state, loading: true };

    case success(FETCH_INVITATIONS):
      return {
        ...state,
        data: action.response.data.data.map((user) => ({
          key: user.id,
          ...user,
        })),
        total: action.response.data.total,
        loading: false,
      };

    case error(FETCH_INVITATIONS):
      return { ...state, loading: false };

    default: return state;
  }
};

export default reducer;
