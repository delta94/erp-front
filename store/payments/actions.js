import {
  ADD_PAYMENT, FETCH_PAYMENT_STATUSES, FETCH_PAYMENTS, CLEAR_PAYMENTS, GENERATE_INVOICE, DELETE_PAYMENT,
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
  meta: { subState: 'statuses' },
});

export const addPayment = (data) => {
  const payload = { ...data };
  if (payload.options?.due_date) payload.options.due_date = payload.options.due_date.format('YYYY-MM-DD');
  if (payload.options?.date) payload.options.date = payload.options.date.format('YYYY-MM-DD');
  return {
    type: ADD_PAYMENT,
    request: {
      method: 'POST',
      url: '/payments',
      data: payload,
    },
  };
};

export const deletePayment = (id) => ({
  type: DELETE_PAYMENT,
  request: {
    method: 'DELETE',
    url: `/payments/${id}`,
  },
});

export const generateInvoice = (data, meta = {}) => {
  const payload = { ...data };
  if (payload.options?.due_date) payload.options.due_date = payload.options.due_date.format('YYYY-MM-DD');
  if (payload.options?.date) payload.options.date = payload.options.date.format('YYYY-MM-DD');

  return ({
    type: GENERATE_INVOICE,
    request: {
      method: 'POST',
      url: '/payments/invoice',
      data,
      responseType: 'blob',
    },
    meta: { ...meta },
  });
};

export const clearPayments = () => ({
  type: CLEAR_PAYMENTS,
});
