import { success, error } from '@redux-requests/core';

import { FETCH_PROJECTS, FETCH_PROJECT_STATUSES, CLEAN_UP_PROJECTS } from './types';
import { mapPaginationResponse } from '../mutations';

const initialState = {
  data: [],
  statuses: [],
  total: 0,
  loading: false,
  statusesLoading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAN_UP_PROJECTS:
      return initialState;

    case FETCH_PROJECTS:
      return { ...state, loading: true };

    case FETCH_PROJECT_STATUSES:
      return { ...state, statusesLoading: true };

    case success(FETCH_PROJECTS):
      return mapPaginationResponse(state, action);

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
