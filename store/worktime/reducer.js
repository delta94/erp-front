import { success, error } from '@redux-requests/core';

import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mutateState,
} from '../mutations';
import { FETCH_WORKTIME, FETCH_WORKTIME_ITEM, CLEAR_WORKTIME } from './types';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WORKTIME:
      return mutateState(state, action, { loading: true });
    case FETCH_WORKTIME_ITEM:
      return mutateState(state, action, { loading: true }, 'item');

    case success(FETCH_WORKTIME):
      return mapPaginationResponse(state, action);
    case success(FETCH_WORKTIME_ITEM):
      return mapSingleEntityResponse(state, action);

    case error(FETCH_WORKTIME):
      return mapError(state, action);
    case error(FETCH_WORKTIME_ITEM):
      return mapError(state, action, 'item');

    case CLEAR_WORKTIME:
      return { ...initialState };

    default: return state;
  }
};

export default reducer;
