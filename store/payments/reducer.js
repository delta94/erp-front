import { success, error } from '@redux-requests/core';
import {
  CLEAR_PAYMENTS,
  FETCH_PAYMENT_STATUSES,
  FETCH_PAYMENTS,
  FETCH_PAYMENT,
} from './types';
import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mutateState, mutateSubState,
} from '../mutations';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
  statuses: { ...ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_PAYMENTS:
      return initialState;

    case FETCH_PAYMENTS:
      return mutateState(state, action, { loading: true });
    case FETCH_PAYMENT:
      return mutateState(state, action, { loading: true }, 'item');
    case FETCH_PAYMENT_STATUSES:
      return mutateSubState(state, action, { loading: true });

    case success(FETCH_PAYMENT):
      return mapSingleEntityResponse(state, action);
    case success(FETCH_PAYMENTS):
      return mapPaginationResponse(state, action);
    case success(FETCH_PAYMENT_STATUSES):
      return mutateSubState(state, action, mapPaginationResponse);

    case error(FETCH_PAYMENT):
      return mapError(state, action, 'item');
    case error(FETCH_PAYMENTS):
      return mapError(state, action);
    case error(FETCH_PAYMENT_STATUSES):
      return mutateSubState(state, action, mapError);

    default: return state;
  }
};

export default reducer;
