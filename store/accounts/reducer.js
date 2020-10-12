import { success, error } from '@redux-requests/core';

import { FETCH_ACCOUNTS, FETCH_ACCOUNT, CLEAR_ACCOUNTS } from './types';
import { mapError, mapPaginationResponse, mapSingleEntityResponse } from '../mutations';

const singleEntity = {
  data: {},
  loading: true,
  response: {
    forbidden: false,
    found: false,
  },
};

const initialState = {
  total: 0,
  data: [],
  filters: {},
  loading: false,

  item: { ...singleEntity },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return { ...state, loading: true };

    case FETCH_ACCOUNT:
      return { ...state, item: { ...state.item, loading: true } };

    case success(FETCH_ACCOUNTS):
      return mapPaginationResponse(state, action);

    case success(FETCH_ACCOUNT):
      return mapSingleEntityResponse(state, action);

    case error(FETCH_ACCOUNTS):
      return { ...state, loading: false };

    case error(FETCH_ACCOUNT):
      return mapError(state, action, 'item');

    case CLEAR_ACCOUNTS:
      return { ...initialState };

    default: return state;
  }
};

export default reducer;
