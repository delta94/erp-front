import {
  ADD_PAYMENT, FETCH_PAYMENT_STATUSES, FETCH_PAYMENTS, CLEAR_PAYMENTS, GENERATE_INVOICE,
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

export const generateInvoice = (data, meta = {}) => ({
  type: GENERATE_INVOICE,
  request: {
    method: 'POST',
    url: '/payments/invoice',
    data,
    responseType: 'blob',
  },
  meta: { ...meta },
});

export const clearPayments = () => ({
  type: CLEAR_PAYMENTS,
});
