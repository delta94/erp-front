import { success, error } from '@redux-requests/core';

import {
  FETCH_EXPENSES, FETCH_EXPENSE_STATUSES, FETCH_EXPENSE,
} from './types';
import {
  mapError, mapPaginationResponse, mutateState, mutateSubState,
} from '../mutations';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
  statuses: { ...ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXPENSE:
      return mutateState(state, action, { loading: true }, 'item');
    case FETCH_EXPENSES:
      return mutateState(state, action, { loading: true });
    case FETCH_EXPENSE_STATUSES:
      return mutateSubState(state, action, { loading: true });

    case success(FETCH_EXPENSES):
      return mapPaginationResponse(state, action);
    case success(FETCH_EXPENSE_STATUSES):
      return mapPaginationResponse(state, action);

    case error(FETCH_EXPENSES):
      return mapError(state, action);
    case error(FETCH_EXPENSE):
      return mapError(state, action, 'item');

    default: return state;
  }
};

export default reducer;
