import { success, error } from '@redux-requests/core';

import { FETCH_TAGS, FETCH_TAG, ADD_TAG } from './types';
import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mapAdditionResponse,
} from '../mutations';

const singleEntity = {
  data: {},
  loading: true,
  response: {
    forbidden: false,
    found: false,
  },
};

const initialState = {
  total: 0,
  data: [],
  filters: {},
  loading: false,

  item: { ...singleEntity },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TAGS:
      return { ...state, loading: true };

    case FETCH_TAG:
      return { ...state, item: { ...state.item, loading: true } };

    case success(FETCH_TAGS):
      return mapPaginationResponse(state, action);

    case success(FETCH_TAG):
      return mapSingleEntityResponse(state, action);

    case success(ADD_TAG):
      return mapAdditionResponse(state, action);

    case error(FETCH_TAGS):
      return { ...state, loading: false };

    case error(FETCH_TAG):
      return mapError(state, action, 'item');

    default: return state;
  }
};

export default reducer;
