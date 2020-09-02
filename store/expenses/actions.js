import {
  FETCH_EXPENSES, FETCH_EXPENSE_STATUSES, ADD_EXPENSE,
} from './types';

import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchExpenses = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_EXPENSES,
    request: {
      method: 'GET',
      url: '/expenses',
      params,
    },
  };
};

export const fetchExpenseStatuses = () => ({
  type: FETCH_EXPENSE_STATUSES,
  request: {
    method: 'GET',
    url: '/expenses/statuses',
  },
});

export const addExpense = (data) => ({
  type: ADD_EXPENSE,
  request: {
    method: 'POST',
    url: '/expenses',
    data,
  },
});
