import {
  INVITE_USERS, FETCH_INVITATIONS,
} from './types';

import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchInvitations = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_INVITATIONS,
    request: {
      method: 'GET',
      url: '/invitations',
      params,
    },
  };
};

export const inviteUsers = (data) => (
  {
    type: INVITE_USERS,
    request: {
      method: 'POST',
      url: '/invitations',
      data,
    },
  }
);
