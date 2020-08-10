import {
  FETCH_USERS,
} from './types';
import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchUsers = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_USERS,
    request: {
      method: 'GET',
      url: '/users',
      params,
    },
  };
};