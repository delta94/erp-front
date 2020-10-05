import { success, error } from '@redux-requests/core';
import {
  CLEAR_PAYMENTS,
  FETCH_PAYMENT_STATUSES,
  FETCH_PAYMENTS,
} from './types';
import { mapPaginationResponse, mutateSubState } from '../mutations';

const subState = {
  data: [],
  filters: {},
  total: 0,
  loading: false,
  forbidden: false,
};

const singleEntity = {
  user: {},
  userLoading: true,
  found: false,
  forbidden: false,
};

const initialState = {
  data: [],
  total: 0,
  loading: false,

  ...{ singleEntity },
  statuses: { ...subState },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_PAYMENTS:
      return initialState;

    case FETCH_PAYMENTS:
      return { ...state, loading: true };

    case success(FETCH_PAYMENTS):
      return mapPaginationResponse(state, action);

    case success(FETCH_PAYMENT_STATUSES):
      return mutateSubState(state, action, mapPaginationResponse);

    case error(FETCH_PAYMENTS):
      return {
        ...state, loading: false,
      };

    default: return state;
  }
};

export default reducer;
