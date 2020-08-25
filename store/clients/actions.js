import {
  FETCH_CLIENTS,
} from './types';
import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchClients = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_CLIENTS,
    request: {
      method: 'GET',
      url: '/clients',
      params,
    },
  };
};
