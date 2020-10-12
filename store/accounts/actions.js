import {
  ADD_ACCOUNT, CLEAR_ACCOUNTS, DELETE_ACCOUNT, EDIT_ACCOUNT, FETCH_ACCOUNT, FETCH_ACCOUNTS,
} from './types';
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

export const fetchAccount = (id, params) => ({
  type: FETCH_ACCOUNT,
  request: {
    method: 'GET',
    url: `/accounts/${id}`,
    params,
  },
});

export const addAccount = (data) => ({
  type: ADD_ACCOUNT,
  request: {
    method: 'POST',
    url: '/accounts/',
    data,
  },
});

export const editAccount = (id, data) => ({
  type: EDIT_ACCOUNT,
  request: {
    method: 'PATCH',
    url: `/accounts/${id}`,
    data,
  },
});

export const deleteAccount = (id) => ({
  type: DELETE_ACCOUNT,
  request: {
    method: 'DELETE',
    url: `/accounts/${id}`,
  },
});

export const clearAccounts = () => ({
  type: CLEAR_ACCOUNTS,
});
