import { success, error } from '@redux-requests/core';

import { FETCH_PROJECTS } from './types';
import { reducePaginationResponse } from '../mutations';

const initialState = {
  data: [],
  total: 0,
  loading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECTS:
      return { ...state, loading: true };

    case success(FETCH_PROJECTS):
      return reducePaginationResponse(action, state);

    case error(FETCH_PROJECTS):
      return {
        ...state, loading: false,
      };

    default: return state;
  }
};

export default reducer;
