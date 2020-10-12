import { success, error } from '@redux-requests/core';

import {
  FETCH_USER_ROLES,
  FETCH_USERS,
  FETCH_USER,
  FETCH_USER_RAISES,
  FETCH_USER_PAYMENTS,
  FETCH_USER_PROJECTS,
  FETCH_USER_WORKTIME,
  FETCH_USER_CALENDAR,
  DELETE_USER_WORKTIME,
  CLEAR_USERS,
  CLEAR_USER_SUB_STATE,
  FETCH_USER_STATUSES,
} from './types';
import {
  mutateSubState, mapPaginationResponse, removeDeletedItemFromList, mapError,
} from '../mutations';

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
  loading: true,

  ...singleEntity,

  raises: { ...subState },
  projects: { ...subState },
  payments: { ...subState },
  worktime: { ...subState },
  calendar: { ...subState },
  roles: { ...subState },
  statuses: { ...subState },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, loading: true };

    case FETCH_USER:
      return { ...state, userLoading: true, userFound: false };

    case FETCH_USER_PAYMENTS:
    case FETCH_USER_RAISES:
    case FETCH_USER_PROJECTS:
    case FETCH_USER_WORKTIME:
    case FETCH_USER_CALENDAR:
    case FETCH_USER_ROLES:
    case FETCH_USER_STATUSES:
      return mutateSubState(state, action, { loading: true });

    case success(FETCH_USERS):
      return mapPaginationResponse(state, action);

    case success(FETCH_USER):
      return {
        ...state, userLoading: false, user: action.response.data, userFound: true,
      };

    case success(DELETE_USER_WORKTIME):
      return mutateSubState(state, action, removeDeletedItemFromList);

    case success(FETCH_USER_PAYMENTS):
    case success(FETCH_USER_RAISES):
    case success(FETCH_USER_PROJECTS):
    case success(FETCH_USER_WORKTIME):
    case success(FETCH_USER_CALENDAR):
    case success(FETCH_USER_ROLES):
    case success(FETCH_USER_STATUSES):
      return mutateSubState(state, action, mapPaginationResponse);

    case error(FETCH_USERS):
      return { ...state, loading: false };

    case CLEAR_USERS:
    case error(FETCH_USER):
      return { ...state, ...singleEntity };

    case CLEAR_USER_SUB_STATE:
      return mutateSubState(state, action, subState);

    case error(FETCH_USER_PAYMENTS):
    case error(FETCH_USER_RAISES):
    case error(FETCH_USER_PROJECTS):
    case error(FETCH_USER_WORKTIME):
    case error(FETCH_USER_CALENDAR):
    case error(FETCH_USER_ROLES):
    case error(FETCH_USER_STATUSES):
      return mutateSubState(state, action, mapError);

    default: return state;
  }
};

export default reducer;
