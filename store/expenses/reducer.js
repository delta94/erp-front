import { success, error } from '@redux-requests/core';
import {
  FETCH_EXPENSES, FETCH_EXPENSE_STATUSES,
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
    case FETCH_EXPENSES:
      return { ...state, loading: true };

    case success(FETCH_EXPENSES):
      return reducePaginationResponse(action, state);

    case success(FETCH_EXPENSE_STATUSES):
      return { ...state, statuses: action.response.data.data, statusesLoading: false };

    case error(FETCH_EXPENSES):
      return {
        ...state, loading: false,
      };

    default: return state;
  }
};

export default reducer;
