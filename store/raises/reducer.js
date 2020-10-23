import { success, error } from '@redux-requests/core';

import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mutateState,
} from '../mutations';
import { FETCH_RAISES, FETCH_RAISE, CLEAR_RAISES } from './types';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RAISES:
      return mutateState(state, action, { loading: true });
    case FETCH_RAISE:
      return mutateState(state, action, { loading: true }, 'item');

    case success(FETCH_RAISES):
      return mapPaginationResponse(state, action);
    case success(FETCH_RAISE):
      return mapSingleEntityResponse(state, action);

    case error(FETCH_RAISES):
      return mapError(state, action);
    case error(FETCH_RAISE):
      return mapError(state, action, 'item');

    case CLEAR_RAISES:
      return { ...initialState };

    default: return state;
  }
};

export default reducer;
