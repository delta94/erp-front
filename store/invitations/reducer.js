import { error, success } from '@redux-requests/core';

import { FETCH_INVITATIONS, FETCH_INVITATION_BY_CODE } from './types';
import { mapPaginationResponse } from '../mutations';

const initialState = {
  data: [],
  total: 0,
  loading: false,
  invitation: null,
  invitationLoading: true,
  invitationFound: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INVITATIONS:
      return { ...state, loading: true };

    case FETCH_INVITATION_BY_CODE:
      return { ...state, invitationLoading: true, invitationFound: false };

    case success(FETCH_INVITATIONS):
      return mapPaginationResponse(state, action);

    case success(FETCH_INVITATION_BY_CODE):
      return {
        ...state, invitation: action.response.data, invitationFound: true, invitationLoading: false,
      };

    case error(FETCH_INVITATIONS):
      return { ...state, loading: false };

    case error(FETCH_INVITATION_BY_CODE):
      return { ...state, invitationFound: false, invitationLoading: false };

    default: return state;
  }
};

export default reducer;
