import { success, error } from '@redux-requests/core';

import { FETCH_ACCOUNTS } from './types';
import { reducePaginationResponse } from '../mutations';

const initialState = {
  data: [],
  total: 0,
  loading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return { ...state, loading: true };

    case success(FETCH_ACCOUNTS):
      return reducePaginationResponse(state, action);

    case error(FETCH_ACCOUNTS):
      return {
        ...state, loading: false,
      };

    default: return state;
  }
};

export default reducer;
