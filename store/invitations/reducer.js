import { error, success } from '@redux-requests/core';

import { FETCH_INVITATIONS, FETCH_INVITATION_BY_CODE } from './types';
import {
  mapError, mapPaginationResponse, mapSingleEntityResponse, mutateState,
} from '../mutations';
import { ENTITY_STATE_STANDARD, SINGLE_ENTITY_STATE_STANDARD } from '../../utils/constants';

const initialState = {
  ...ENTITY_STATE_STANDARD,
  item: { ...SINGLE_ENTITY_STATE_STANDARD },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INVITATIONS:
      return mutateState(state, action, { loading: true });
    case FETCH_INVITATION_BY_CODE:
      return mutateState(state, action, { loading: true }, 'item');

    case success(FETCH_INVITATIONS):
      return mapPaginationResponse(state, action);
    case success(FETCH_INVITATION_BY_CODE):
      return mapSingleEntityResponse(state, action);

    case error(FETCH_INVITATIONS):
      return mapError(state, action);
    case error(FETCH_INVITATION_BY_CODE):
      return mapError(state, action, 'item');

    default: return state;
  }
};

export default reducer;
