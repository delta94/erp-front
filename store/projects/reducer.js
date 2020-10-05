import { success, error } from '@redux-requests/core';

import {
  FETCH_PROJECTS,
  FETCH_PROJECT_STATUSES,
  FETCH_PROJECT_ACCOUNTS,
  FETCH_PROJECT_WORKTIME,
  CLEAR_PROJECTS,
} from './types';
import { mapError, mapPaginationResponse, mutateSubState } from '../mutations';

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
  filters: {},
  total: 0,
  loading: false,

  ...singleEntity,
  accounts: { ...subState },
  statuses: { ...subState },
  worktime: { ...subState },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_PROJECTS:
      return initialState;

    case FETCH_PROJECTS:
      return { ...state, loading: true };

    case FETCH_PROJECT_STATUSES:
    case FETCH_PROJECT_ACCOUNTS:
    case FETCH_PROJECT_WORKTIME:
      return mutateSubState(state, action, { loading: true });

    case success(FETCH_PROJECTS):
      return mapPaginationResponse(state, action);

    case success(FETCH_PROJECT_ACCOUNTS):
    case success(FETCH_PROJECT_STATUSES):
    case success(FETCH_PROJECT_WORKTIME):
      return mutateSubState(state, action, mapPaginationResponse);

    case error(FETCH_PROJECTS):
      return { ...state, loading: false };

    case error(FETCH_PROJECT_STATUSES):
    case error(FETCH_PROJECT_ACCOUNTS):
    case error(FETCH_PROJECT_WORKTIME):
      return mutateSubState(state, action, mapError);

    default: return state;
  }
};

export default reducer;
