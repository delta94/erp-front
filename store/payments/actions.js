import {
  ADD_PAYMENT, FETCH_PAYMENT_STATUSES, FETCH_PAYMENTS,
} from './types';

import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchPayments = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_PAYMENTS,
    request: {
      method: 'GET',
      url: '/payments',
      params,
    },
  };
};

export const fetchPaymentStatuses = () => ({
  type: FETCH_PAYMENT_STATUSES,
  request: {
    method: 'GET',
    url: '/payments/statuses',
  },
});

export const addPayment = (data) => ({
  type: ADD_PAYMENT,
  request: {
    method: 'POST',
    url: '/payments',
    data,
  },
});
