import { success, error } from '@redux-requests/core';

import {
  FETCH_PROJECTS,
  FETCH_PROJECT_STATUSES,
  FETCH_PROJECT_ACCOUNTS,
  FETCH_PROJECT_WORKTIME,
  CLEAR_PROJECTS,
  FETCH_PROJECT,
  CLEAR_PROJECT_SUB_STATE, FETCH_PROJECT_USERS,
} from './types';
import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mutateState, mutateSubState,
} from '../mutations';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,

  item: { ...SINGLE_ENTITY_STATE_STANDARD },
  accounts: { ...ENTITY_STATE_STANDARD },
  statuses: { ...ENTITY_STATE_STANDARD },
  worktime: { ...ENTITY_STATE_STANDARD },
  users: { ...ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_PROJECTS:
      return initialState;
    case CLEAR_PROJECT_SUB_STATE:
      return mutateSubState(state, action, ENTITY_STATE_STANDARD);

    case FETCH_PROJECTS:
      return mutateState(state, action, { loading: true });
    case FETCH_PROJECT:
      return mutateState(state, action, { loading: true }, 'item');
    case FETCH_PROJECT_STATUSES:
    case FETCH_PROJECT_ACCOUNTS:
    case FETCH_PROJECT_WORKTIME:
    case FETCH_PROJECT_USERS:
      return mutateSubState(state, action, { loading: true });

    case success(FETCH_PROJECTS):
      return mapPaginationResponse(state, action);
    case success(FETCH_PROJECT):
      return mapSingleEntityResponse(state, action);
    case success(FETCH_PROJECT_ACCOUNTS):
    case success(FETCH_PROJECT_STATUSES):
    case success(FETCH_PROJECT_WORKTIME):
    case success(FETCH_PROJECT_USERS):
      return mutateSubState(state, action, mapPaginationResponse);

    case error(FETCH_PROJECTS):
      return mapError(state, action);
    case error(FETCH_PROJECT):
      return mapError(state, action, 'item');
    case error(FETCH_PROJECT_STATUSES):
    case error(FETCH_PROJECT_ACCOUNTS):
    case error(FETCH_PROJECT_WORKTIME):
    case error(FETCH_PROJECT_USERS):
      return mutateSubState(state, action, mapError);

    default: return state;
  }
};

export default reducer;
