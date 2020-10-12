import { success, error } from '@redux-requests/core';

import {
  FETCH_CLIENT, FETCH_CLIENT_FIELD_TYPES, FETCH_CLIENT_ORIGINS, FETCH_CLIENTS,
} from './types';
import { mapError, mapPaginationResponse, mutateSubState } from '../mutations';

const subState = {
  data: [],
  filters: {},
  total: 0,
  loading: false,
  forbidden: false,
};

const singleEntity = {
  client: {},
  clientLoading: true,
  found: false,
  forbidden: false,
};

const initialState = {
  total: 0,
  data: [],
  filters: {},
  loading: false,

  ...singleEntity,

  origins: { ...subState },
  fieldTypes: { ...subState },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CLIENTS:
      return { ...state, loading: true };
    case FETCH_CLIENT:
      return { ...state, clientLoading: true };

    case FETCH_CLIENT_FIELD_TYPES:
    case FETCH_CLIENT_ORIGINS:
      return mutateSubState(state, action, { loading: true });

    case success(FETCH_CLIENTS):
      return mapPaginationResponse(state, action);

    case success(FETCH_CLIENT_FIELD_TYPES):
    case success(FETCH_CLIENT_ORIGINS):
      return mutateSubState(state, action, mapPaginationResponse);

    case success(FETCH_CLIENT):
      return {
        ...state, client: action.response.data, clientLoading: false, found: true,
      };

    case error(FETCH_CLIENTS):
      return { ...state, loading: false };

    case error(FETCH_CLIENT_ORIGINS):
    case error(FETCH_CLIENT_FIELD_TYPES):
      return mutateSubState(state, action, mapError);

    case error(FETCH_CLIENT):
      return { ...state, found: false, clientLoading: false };

    default: return state;
  }
};

export default reducer;
