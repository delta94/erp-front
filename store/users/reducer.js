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
  mutateSubState, mapPaginationResponse, removeDeletedItemFromList, mapError, mutateState, mapSingleEntityResponse,
} from '../mutations';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
  raises: { ...ENTITY_STATE_STANDARD },
  projects: { ...ENTITY_STATE_STANDARD },
  payments: { ...ENTITY_STATE_STANDARD },
  worktime: { ...ENTITY_STATE_STANDARD },
  calendar: { ...ENTITY_STATE_STANDARD },
  roles: { ...ENTITY_STATE_STANDARD },
  statuses: { ...ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return mutateState(state, action, { loading: true });
    case FETCH_USER:
      return mutateState(state, action, { loading: true }, 'item');

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
      return mapSingleEntityResponse(state, action);
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
      return mapError(state, action);
    case error(FETCH_USER):
      return mapError(state, action, 'item');

    case CLEAR_USERS:
      return mutateState(state, action, { ...ENTITY_STATE_STANDARD });
    case CLEAR_USER_SUB_STATE:
      return mutateSubState(state, action, ENTITY_STATE_STANDARD);

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
