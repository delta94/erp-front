import { success, error } from '@redux-requests/core';
import {
  FETCH_PAYMENT_STATUSES, FETCH_PAYMENTS,
} from './types';
import { reducePaginationResponse } from '../mutations';

const initialState = {
  data: [],
  statuses: [],
  total: 0,
  loading: false,
  statusesLoading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PAYMENTS:
      return { ...state, loading: true };

    case success(FETCH_PAYMENTS):
      return reducePaginationResponse(action, state);

    case success(FETCH_PAYMENT_STATUSES):
      return { ...state, statuses: action.response.data.data, statusesLoading: false };

    case error(FETCH_PAYMENTS):
      return {
        ...state, loading: false,
      };

    default: return state;
  }
};

export default reducer;