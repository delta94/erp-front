import { success, error } from '@redux-requests/core';

import {
  FETCH_CLIENT, FETCH_CLIENT_FIELD_TYPES, FETCH_CLIENT_ORIGINS, FETCH_CLIENTS,
} from './types';
import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mutateState, mutateSubState,
} from '../mutations';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
  origins: { ...ENTITY_STATE_STANDARD },
  fieldTypes: { ...ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CLIENTS:
      return mutateState(state, action, { loading: true });
    case FETCH_CLIENT:
      return mutateState(state, action, { loading: true }, 'item');

    case FETCH_CLIENT_FIELD_TYPES:
    case FETCH_CLIENT_ORIGINS:
      return mutateSubState(state, action, { loading: true });

    case success(FETCH_CLIENTS):
      return mapPaginationResponse(state, action);

    case success(FETCH_CLIENT_FIELD_TYPES):
    case success(FETCH_CLIENT_ORIGINS):
      return mutateSubState(state, action, mapPaginationResponse);

    case success(FETCH_CLIENT):
      return mapSingleEntityResponse(state, action);

    case error(FETCH_CLIENTS):
      return mapError(state, action);

    case error(FETCH_CLIENT_ORIGINS):
    case error(FETCH_CLIENT_FIELD_TYPES):
      return mutateSubState(state, action, mapError);

    case error(FETCH_CLIENT):
      return mapError(state, action, 'item');

    default: return state;
  }
};

export default reducer;
