import { success, error } from '@redux-requests/core';

import { FETCH_PROJECTS, FETCH_PROJECT_STATUSES } from './types';
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
    case FETCH_PROJECTS:
      return { ...state, loading: true };

    case FETCH_PROJECT_STATUSES:
      return { ...state, statusesLoading: true };

    case success(FETCH_PROJECTS):
      return reducePaginationResponse(action, state);

    case success(FETCH_PROJECT_STATUSES):
      return { ...state, statuses: action.response.data.data, statusesLoading: false };

    case error(FETCH_PROJECTS):
      return { ...state, loading: false };

    case error(FETCH_PROJECT_STATUSES):
      return { ...state, statusesLoading: false };

    default: return state;
  }
};

export default reducer;
