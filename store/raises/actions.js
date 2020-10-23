import moment from 'moment';

import {
  FETCH_RAISES, FETCH_RAISE, ADD_RAISE, EDIT_RAISE, DELETE_RAISE, CLEAR_RAISES,
} from './types';
import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchRaises = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_RAISES,
    request: {
      method: 'GET',
      url: '/raises',
      params,
    },
  };
};

export const fetchRaise = (id, params) => ({
  type: FETCH_RAISE,
  request: {
    method: 'GET',
    url: `/raises/${id}`,
    params,
  },
});

export const addRaise = (data) => {
  const payload = { ...data };
  if (moment.isMoment(payload.starting_from)) payload.starting_from = payload.starting_from.format('YYYY-MM-DD');
  return ({
    type: ADD_RAISE,
    request: {
      method: 'POST',
      url: '/raises',
      data: payload,
    },
  });
};

export const editRaise = (id, data) => {
  const payload = { ...data };
  if (moment.isMoment(payload.starting_from)) payload.starting_from = payload.starting_from.format('YYYY-MM-DD');
  return ({
    type: EDIT_RAISE,
    request: {
      method: 'PATCH',
      url: `/raises/${id}`,
      data: payload,
    },
  });
};

export const deleteRaise = (id) => ({
  type: DELETE_RAISE,
  request: {
    method: 'DELETE',
    url: `/raises/${id}`,
  },
});

export const clearRaises = () => ({
  type: CLEAR_RAISES,
});
