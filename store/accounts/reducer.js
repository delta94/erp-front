import { success, error } from '@redux-requests/core';

import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mutateState, mutateSubState,
} from '../mutations';
import {
  FETCH_ACCOUNTS, FETCH_ACCOUNT, CLEAR_ACCOUNTS, FETCH_ACCOUNT_CATEGORIES,
} from './types';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
  categories: { ...ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return mutateState(state, action, { loading: true });
    case FETCH_ACCOUNT:
      return mutateState(state, action, { loading: true }, 'item');
    case FETCH_ACCOUNT_CATEGORIES:
      return mutateState(state, action, { loading: true });

    case success(FETCH_ACCOUNTS):
      return mapPaginationResponse(state, action);
    case success(FETCH_ACCOUNT):
      return mapSingleEntityResponse(state, action);
    case success(FETCH_ACCOUNT_CATEGORIES):
      return mutateSubState(state, action, mapPaginationResponse);

    case error(FETCH_ACCOUNTS):
      return mapError(state, action);
    case error(FETCH_ACCOUNT):
      return mapError(state, action, 'item');
    case error(FETCH_ACCOUNT_CATEGORIES):
      return mutateSubState(state, action, mapError);

    case CLEAR_ACCOUNTS:
      return { ...initialState };

    default: return state;
  }
};

export default reducer;
