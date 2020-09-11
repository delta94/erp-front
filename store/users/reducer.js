import { success, error } from '@redux-requests/core';

import {
  FETCH_USER_ROLES,
  FETCH_USERS,
  FETCH_USER,
  FETCH_USER_RAISES,
  FETCH_USER_PAYMENTS,
  FETCH_USER_PROJECTS,
  FETCH_USER_WORKTIME,
  FETCH_USER_CALENDAR, DELETE_USER_WORKTIME,
} from './types';
import { mutateSubState, reducePaginationResponse, removeDeletedItemFromList } from '../mutations';

const subState = {
  data: [],
  filters: {},
  total: 0,
  loading: false,
};

const initialState = {
  data: [],
  roles: [],
  filters: {},
  user: {},
  total: 0,
  loading: false,
  rolesLoading: false,
  userLoading: false,
  userFound: false,

  raises: { ...subState },
  projects: { ...subState },
  payments: { ...subState },
  worktime: { ...subState },
  calendar: { ...subState },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, loading: true };

    case FETCH_USER_ROLES:
      return { ...state, rolesLoading: true };

    case FETCH_USER:
      return { ...state, userLoading: true, userFound: false };

    case FETCH_USER_PAYMENTS:
    case FETCH_USER_RAISES:
    case FETCH_USER_PROJECTS:
    case FETCH_USER_WORKTIME:
    case FETCH_USER_CALENDAR:
      return mutateSubState(state, action, { loading: true });

    case success(FETCH_USERS):
      return reducePaginationResponse(state, action);

    case success(FETCH_USER_ROLES):
      return {
        ...state,
        roles: action.response.data.data,
        rolesLoading: false,
      };

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
      return mutateSubState(state, action, reducePaginationResponse);

    case error(FETCH_USERS):
      return { ...state, loading: false };

    case error(FETCH_USER_ROLES):
      return { ...state, rolesLoading: false };

    case error(FETCH_USER):
      return { ...state, userLoading: false, userFound: false };

    case error(FETCH_USER_PAYMENTS):
    case error(FETCH_USER_RAISES):
    case error(FETCH_USER_PROJECTS):
    case error(FETCH_USER_WORKTIME):
    case error(FETCH_USER_CALENDAR):
      return mutateSubState(state, action, { loading: false });

    default: return state;
  }
};

export default reducer;
