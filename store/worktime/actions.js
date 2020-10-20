import moment from 'moment';

import {
  FETCH_WORKTIME, FETCH_WORKTIME_ITEM, ADD_WORKTIME, EDIT_WORKTIME, DELETE_WORKTIME, CLEAR_WORKTIME,
} from './types';
import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchWorktime = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_WORKTIME,
    request: {
      method: 'GET',
      url: '/worktime',
      params,
    },
  };
};

export const fetchWorktimeItem = (id, params) => ({
  type: FETCH_WORKTIME_ITEM,
  request: {
    method: 'GET',
    url: `/worktime/${id}`,
    params,
  },
});

export const addWorktime = (data) => {
  const payload = { ...data };
  if (payload.date.length > 1) {
    payload.from = moment.isMoment(payload.date[0]) ? payload.date[0].format('YYYY-MM-DD') : payload.date[0];
    payload.to = moment.isMoment(payload.date[1]) ? payload.date[1].format('YYYY-MM-DD') : payload.date[1];
    delete payload.date;
  } else if (moment.isMoment(payload.date)) {
    payload.date = payload.date.format('YYYY-MM-DD');
  }
  if (moment.isMoment(payload.time)) payload.time = payload.time.hour() + payload.time.minute() / 60;
  return ({
    type: ADD_WORKTIME,
    request: {
      method: 'POST',
      url: '/worktime',
      data: payload,
    },
  });
};

export const editWorktime = (id, data) => ({
  type: EDIT_WORKTIME,
  request: {
    method: 'PATCH',
    url: `/worktime/${id}`,
    data,
  },
});

export const deleteWorktime = (id) => ({
  type: DELETE_WORKTIME,
  request: {
    method: 'DELETE',
    url: `/worktime/${id}`,
  },
});

export const clearWorktime = () => ({
  type: CLEAR_WORKTIME,
});
