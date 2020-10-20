import { success, error } from '@redux-requests/core';

import { FETCH_TAGS, FETCH_TAG, ADD_TAG } from './types';
import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mapAdditionResponse, mutateState,
} from '../mutations';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TAGS:
      return mutateState(state, action, { loading: true });
    case FETCH_TAG:
      return mutateState(state, action, { loading: true }, 'item');

    case success(FETCH_TAGS):
      return mapPaginationResponse(state, action);
    case success(FETCH_TAG):
      return mapSingleEntityResponse(state, action);
    case success(ADD_TAG):
      return mapAdditionResponse(state, action);

    case error(FETCH_TAGS):
      return mapError(state, action);
    case error(FETCH_TAG):
      return mapError(state, action, 'item');

    default: return state;
  }
};

export default reducer;
