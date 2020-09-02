import { FETCH_ACCOUNTS } from './types';
import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchAccounts = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_ACCOUNTS,
    request: {
      method: 'GET',
      url: '/accounts',
      params,
    },
  };
};
