import { success, error } from '@redux-requests/core';

import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mutateState, mutateSubState,
} from '../mutations';
import {
  FETCH_ACCOUNTS,
  FETCH_ACCOUNT,
  CLEAR_ACCOUNTS,
  FETCH_ACCOUNT_CATEGORIES,
  FETCH_ACCOUNT_PROJECTS,
  CLEAR_ACCOUNTS_SUB_STATE,
} from './types';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
  categories: { ...ENTITY_STATE_STANDARD },
  projects: { ...ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return mutateState(state, action, { loading: true });
    case FETCH_ACCOUNT:
      return mutateState(state, action, { loading: true }, 'item');
    case FETCH_ACCOUNT_CATEGORIES:
    case FETCH_ACCOUNT_PROJECTS:
      return mutateState(state, action, { loading: true });

    case success(FETCH_ACCOUNTS):
      return mapPaginationResponse(state, action);
    case success(FETCH_ACCOUNT):
      return mapSingleEntityResponse(state, action);
    case success(FETCH_ACCOUNT_CATEGORIES):
    case success(FETCH_ACCOUNT_PROJECTS):
      return mutateSubState(state, action, mapPaginationResponse);

    case error(FETCH_ACCOUNTS):
      return mapError(state, action);
    case error(FETCH_ACCOUNT):
      return mapError(state, action, 'item');
    case error(FETCH_ACCOUNT_CATEGORIES):
    case error(FETCH_ACCOUNT_PROJECTS):
      return mutateSubState(state, action, mapError);

    case CLEAR_ACCOUNTS:
      return { ...initialState };
    case CLEAR_ACCOUNTS_SUB_STATE:
      return mutateSubState(state, action, ENTITY_STATE_STANDARD);

    default: return state;
  }
};

export default reducer;
