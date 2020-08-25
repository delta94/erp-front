import { error, success } from '@redux-requests/core';

import { FETCH_INVITATIONS } from './types';
import { reducePaginationResponse } from '../mutations';

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
      return reducePaginationResponse(action, state);

    case error(FETCH_INVITATIONS):
      return { ...state, loading: false };

    default: return state;
  }
};

export default reducer;
