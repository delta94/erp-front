import { success, error } from '@redux-requests/core';

import {
  FETCH_CLIENT, FETCH_CLIENT_FIELD_TYPES, FETCH_CLIENT_ORIGINS, FETCH_CLIENTS,
} from './types';
import { reducePaginationResponse } from '../mutations';

const initialState = {
  total: 0,
  data: [],
  fieldTypes: [],
  origins: [],
  loading: false,
  fieldTypesLoading: false,
  originsLoading: false,
  clientLoading: false,
  client: null,
  clientFound: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CLIENTS:
      return { ...state, loading: true };

    case FETCH_CLIENT_ORIGINS:
      return { ...state, originsLoading: true };

    case FETCH_CLIENT_FIELD_TYPES:
      return { ...state, fieldTypesLoading: true };

    case FETCH_CLIENT:
      return { ...state, clientLoading: true };

    case success(FETCH_CLIENTS):
      return reducePaginationResponse(action, state);

    case success(FETCH_CLIENT_ORIGINS):
      return { ...state, origins: action.response.data.data, originsLoading: false };

    case success(FETCH_CLIENT_FIELD_TYPES):
      return { ...state, fieldTypes: action.response.data.data, fieldTypesLoading: false };

    case success(FETCH_CLIENT):
      return {
        ...state, client: action.response.data, clientLoading: false, clientFound: true,
      };

    case error(FETCH_CLIENTS):
      return { ...state, loading: false };

    case error(FETCH_CLIENT_ORIGINS):
      return { ...state, originsLoading: false };

    case error(FETCH_CLIENT_FIELD_TYPES):
      return { ...state, fieldTypesLoading: false };

    case error(FETCH_CLIENT):
      return { ...state, clientFound: false, clientLoading: false };

    default: return state;
  }
};

export default reducer;
