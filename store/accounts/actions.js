import {
  ADD_ACCOUNT,
  CLEAR_ACCOUNTS,
  DELETE_ACCOUNT,
  EDIT_ACCOUNT,
  FETCH_ACCOUNT,
  FETCH_ACCOUNT_CATEGORIES,
  FETCH_ACCOUNT_PROJECT_DETAILS,
  FETCH_ACCOUNTS, FETCH_LAST_ACCOUNT_PAYMENT,
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

export const fetchAccountCategories = () => ({
  type: FETCH_ACCOUNT_CATEGORIES,
  request: {
    method: 'GET',
    url: '/accounts/categories',
  },
  meta: { subState: 'categories' },
});

export const fetchAccountProjectDetails = (accountId, projectId) => ({
  type: FETCH_ACCOUNT_PROJECT_DETAILS,
  request: {
    method: 'GET',
    url: `/accounts/${accountId}/projects/${projectId}`,
  },
});

/**
 * @param {Number} accountId
 * @param {PaginationQuery} query
 * @param {Object=} meta
 */
export const fetchAccountPayments = (accountId, query = { page: 1, size: 10 }, meta) => {
  const params = composeQuery(query);
  return {
    type: FETCH_LAST_ACCOUNT_PAYMENT,
    request: {
      method: 'GET',
      url: `/accounts/${accountId}/payments`,
      params,
    },
    meta,
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
